const express = require("express");
const users = require("../models/userModel");
const app = express();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Access denied!" });
  }

  try {
    const verified = jwt.verify(token, process.env.DB_SUPER_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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
      //Password: req.body.password,
    });
    if (!user || user.length == 0) throw new Error("No user found");

    console.log("Email: ", user);
    const tokenEmail = user[0].Email;

    const token = jwt.sign(
      {
        exp: 216000,
        data: tokenEmail,
      },
      process.env.DB_SUPER_SECRET
    );

    console.log(token);

    res.header("auth-token", token).json({
      error: null,
      data: { Status: 200, Message: "Token signed successfully", data: token },
    });

    // const token = jwt.sign({
    //   expire: Math.floor(Date.now() / 1000) + 60 * 60 * 60, // expires in day
    //   data: user.Email,
    // });

    // connsole.log("JWT: ", token);

    // res.status(200).send(user);
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

app.get("/testJWT/:email", async (req, res) => {
  try {
    const foundUser = users.find({ Email: req.params.email });
    console.log(foundUser.length);

    const token = jwt.sign(
      {
        expire: process.env.expireToken, // expires in 24 hours
        data: req.params.email,
      },
      process.env.DB_SUPER_SECRET
    );

    // const data = {
    //   token: token,
    // };

    res.header("auth-token", token).json({
      error: null,
      data: { Status: 200, Message: "Token signed successfully", data: token },
    });

    console.log(token);
    //res.status(201).json({ Message: "Token signed successfully", data: token });
  } catch (error) {
    console.log("error with jwt: ", error.message);
  }
});

app.get("/testVerify/:email", verifyToken, async (res, req) => {
  try {
    console.log("test verify");
    res.status(200).json({ message: "it works" });
    //res.send("ok verified");

    //let test = verifyToken(req);

    // jwt.verify(
    //   req.header["authorization"],
    //   process.env.DB_SUPER_SECRET,
    //   function (err, decoded) {
    //     console.log("function started");
    //     console.log(decoded);
    //   }
    // );
    // res.send(decoded);
  } catch (error) {
    console.log(error.message);
    res.send("error with authentication");
  }
});

module.exports = app;
