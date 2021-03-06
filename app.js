// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const session = require("express-session");

app.set("trust proxy", 1);

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
      sameSite: "none", //true, //frontend backend both run on localhost //when deploy needs to be "none"
      httpOnly:  false, //true, //we are not using https //when deploy its false,
      secure: true,
      
      // only when deploy: secure: true, 
    },
    rolling: true,
  })
);

function getCurrentLoggedUser (req, res, next) {
  if (req.session && req.session.currentUser) {
      app.locals.loggedInUser = req.session.currentUser; //refer to the username in the model
  } else {
      app.locals.loggedInUser = "";
  }
  next();
};

app.use(getCurrentLoggedUser);


// default value for title local
const projectName = "Kula Lisbon";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const classes = require("./routes/class-routes");
app.use("/api", classes);

const auth = require("./routes/auth-routes");
app.use("/api", auth);

const teachers = require("./routes/teacher-routes");
app.use("/api", teachers);



// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
