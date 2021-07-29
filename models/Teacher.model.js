const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
  teacher: String,
  style: String,
  description: String,
  imageUrl: String,
});

const Teacher = mongoose.model("Teacher", TeacherSchema);

module.exports = Teacher;