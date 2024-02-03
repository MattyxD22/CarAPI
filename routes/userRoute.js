const express = require("express");
const users = require("../models/userModel");
const app = express();

app.get("/", async (req, res) => {
  try {
    const user = await users.find({});
    if (!user) res.status(404).send("No item found");
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log(req.body);

    const user = await users.find({
      Email: req.body.email,
      Password: req.body.password,
    });
    if (!user || user.length == 0) throw new Error("No user found");
    console.log(user);
    res.status(200).send(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

app.get("/checkEmail/:email", async (req, res) => {
  try {
    console.log(req.params.email);
    const user = users.findOne({ Email: req.params.email });
    console.log(user);

    if (!user) {
      res.status(200).send("Ok");
    } else {
      throw new Error("Email already exists");
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

module.exports = app;
