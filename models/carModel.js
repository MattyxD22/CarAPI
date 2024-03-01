const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let cars = new Schema({
  make: { type: String },
  model: { type: String },
  year: { type: Number },
  VIN: { type: String },
  description: { type: String },
  image: [{ name: String, url: String }],
});

module.exports = mongoose.model("cars", cars);
