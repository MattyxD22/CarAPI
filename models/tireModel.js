const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const tbl_tires = new mongoose.Schema({
  tireID: {
    type: Number,
    required: true,
    unique: true,
    index: true,
    validation(value) {
      if (value == "") throw new Error("ID Must be provided");
    },
  },
  tireWidth: {
    type: Number,
    index: true,
    validate(value) {
      if (value == "") throw new Erros("Tire must have a width");
    },
  },
  tireHeight: {
    type: Number,
    required: true,
    validate(value) {
      if (value == "") throw new Erros("Tire must have a width");
    },
  },

  tireRadius: {
    type: Number,
    required: true,
    validate(value) {
      if (value == "") throw new Erros("Tire must have a radius");
    },
  },
});

const Tire = mongoose.model("tbl_tire", tbl_tire);
module.exports = Tire;
