const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let users = new Schema({
  Email: { type: String },
  Password: { type: String },
});

module.exports = mongoose.model("users", users);
