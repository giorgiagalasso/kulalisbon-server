const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema({
  teacher: String,
  title: String,
  description: String,
  imageUrl: String,
  price: Number,
  category: String,
  time: Number,
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
