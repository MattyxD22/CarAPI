const express = require("express");
const users = require("../models/userModel");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const saltRounds = 25;

bcrypt.genSalt(saltRounds);

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
    const user = await users.findOne({
      email: req.body.email,
    });

    if (!user || user.length == 0 || user === null) {
      res.status(404).json({
        error: "No match",
        message: "no user found with provided information",
      });
    } else {
      const compare = bcrypt.compareSync(req.body.password, user.password);
      if (!compare) {
        throw new Error("Email or Password doesnt match");
      }

      const tokenEmail = user.Email + ":" + Date.now().toString(); // date.now() is for creating an UID

      const token = jwt.sign(
        {
          exp: Date.now() / 1000 + 60 * 60 * 24, // token should expire in 24 hours
          data: tokenEmail,
        },
        process.env.SECRET
      );

      res.cookie("auth-token", token, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "none",
      });

      res.header("auth-token", token).json({
        error: null,
        data: {
          Status: 200,
          Message: "Token signed successfully",
          data: token,
        },
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

//this one was tricky, but setting it up to use proper async/await fixed it
app.get("/checkEmail/:email", async (req, res) => {
  try {
    let user;

    await users.find({ email: req.params.email }).then(async (data) => {
      user = data;
    });

    //check if user is null or the user variable is an empty array
    if (!user || user.length === 0) {
      res
        .status(200)
        .json({ Exist: false, Message: "No user with this email exists" });
    } else {
      res
        .status(409)
        .json({ Exist: true, Message: "a user with this email exists" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

app.post("/createAccount", async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10);

    await users.create({
      email: req.body.email,
      password: hash,
    });

    res.status(200).json({
      status: "Success",
      message: "User Account created successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Something went wrong when creating a new user",
    });
  }
});

module.exports = app;
