const express = require("express");
const router = express.Router();
const Class = require("../models/Class.model");
const fileUpload = require("../config/cloudinary");

function requireLogin(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.status(401).json({ message: "unauthorized" });
  }
}


function requireAdmin(req, res, next) {  
  if (req.session.currentUser && 
      req.session.currentUser.role === "Admin"){
          next();
  } else {
          res.redirect("/");
  }
};

//Upload image cloudinary
router.post("/upload",requireAdmin, fileUpload.single("image"), (req, res) => {
  try {
    res.status(200).json({ fileUrl: req.file.path });
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

//Get all projects
router.get("/classes", requireAdmin, async (req, res) => {
  try {
    const allClasses = await Class.find();
    res.status(200).json(allClasses);
    console.log("here here here");
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

//Create project
router.post("/classes", requireAdmin, async (req, res) => {
  const { teacher, title, description, category, time, price, imageUrl } = req.body;
  if(req.file){

  }
  if (!title || !description) {
    res.status(400).json({ message: "missing fields" });
    return;
  }
  try {
    const response = await Class.create({
        teacher,
      title,
      description,
      category,
      time,
      price,
      imageUrl
    });
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

//Delete project
router.delete("/classes/:id", requireAdmin, async (req, res) => {
  try {
    await Class.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: `id ${req.params.id} was deleted` });
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

//Get project by id
router.get("/classes/:id", requireAdmin, async (req, res) => {
  try {
    const response = await Class.findById(req.params.id);
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

//Update project
router.put("/classes/:id", requireAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    await Class.findByIdAndUpdate(req.params.id, {
      title,
      description,
    });
    res.status(200).json(`id ${req.params.id} was updated`);
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

module.exports = router;
