const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let users = new Schema({
  email: { type: String },
  password: { type: String },
});

module.exports = mongoose.model("users", users);
