const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher.model");
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
    res.status(401).json({ message: "you are not an admin"});
  }
};




//Upload image cloudinary
router.post("/upload", fileUpload.single("image"), (req, res) => {
  try {
    console.log("in upload")
    res.status(200).json({ fileUrl: req.file.path });
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

//Get all projects
router.get("/teachers",  async (req, res) => {
  try {
    const allTeachers = await Teacher.find();
    res.status(200).json(allTeachers);
    console.log("here here here");
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

//Create project
router.post("/teachers", requireAdmin, async (req, res) => {
  const { teacher,description, imageUrl } = req.body;
  if(req.file){

  }
  if (!teacher || !description) {
    res.status(400).json({ message: "missing fields" });
    return;
  }
  try {
    const response = await Teacher.create({
      teacher,
      description,
      imageUrl
    });
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

//Delete project
router.delete("/teachers/:id", requireAdmin, async (req, res) => {
  try {
    await Teacher.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: `id ${req.params.id} was deleted` });
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

//Get project by id
router.get("/teachers/:id", requireAdmin, async (req, res) => {
  try {
    const response = await Teacher.findById(req.params.id);
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});

//Update project
router.put("/teachers/:id", requireAdmin, async (req, res) => {
  try {
    const { teacher, description, imageUrl} = req.body;
    await Teacher.findByIdAndUpdate(req.params.id, {
      teacher,
      description,
      imageUrl,
    });
    res.status(200).json(`id ${req.params.id} was updated`);
  } catch (e) {
    res.status(500).json({ message: `error occurred ${e}` });
  }
});


module.exports = router;
