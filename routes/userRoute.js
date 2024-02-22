const express = require("express");
const users = require("../models/userModel");
const app = express();
const jwt = require("jsonwebtoken");
const verifyToken = require("../auth");

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

    console.log("Email: ", user);
    const tokenEmail = user[0].Email + ":" + Date.now().toString(); // date.now() is for creating an UID

    const token = jwt.sign(
      {
        exp: (Date.now() / 1000) + (60 * 60 * 24), // token should expire in 24 hours
        data: tokenEmail,
      },
      process.env.DB_SUPER_SECRET
    );

    console.log(token);

    res.header("auth-token", token).json({
      error: null,
      data: { Status: 200, Message: "Token signed successfully", data: token },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

app.get("/checkEmail/:email", async (req, res) => {
  try {
    console.log(req.params.email);

    const user = users.find({ Email: req.params.email });
    //console.log(user);

    if (!user.length) {
      console.log("no email found, proceed");

      res.status(200).send("Ok");
    } else {
      console.log("email already exists");

      throw new Error("Email already exists");
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

module.exports = app;
