const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const tbl_users = new mongoose.Schema({
  userID: {
    type: Number,
    required: true,
    unique: true,
    index: true,
    validation(value) {
      if (value == "") throw new Error("ID Must be provided");
    },
  },
  userEmail: {
    type: String,
    index: true,
    validate(value) {
      if (value == "") throw new Erros("User must have an Email");
    },
  },
  userPassword: {
    type: Number,
    required: true,
    validate(value) {
      if (value == "") throw new Erros("User must have a Password");
    },
  },
});

const User = mongoose.model("tbl_users", tbl_users);
module.exports = User;
