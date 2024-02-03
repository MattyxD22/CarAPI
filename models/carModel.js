const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let cars = new Schema({
  Make: { type: String },
  Model: { type: String },
  Year: { type: Number },
  VIN: { type: String },
  Description: { type: String },
  Image: [{ name: String, url: String }],
});

module.exports = mongoose.model("cars", cars);
