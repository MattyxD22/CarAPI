const express = require("express");
const cars = require("../models/carModel");
const app = express();
const multer = require("multer");
const jwt = require("jsonwebtoken");

//use multer to create temporary storage and add ability to upload images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
    res.status(400).json({ error: err });
  }
};

app.get("/helloCars", async (req, res) => {
  res.send("hello world!");
});

app.get("/", async (req, res) => {
  //console.log("request recieved", req);
  try {
    const car = await cars.find({});
    if (!car) res.status(404).send("No item found");
    //console.log(car);
    res.status(200).send(car);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/carVIN/:carVIN", async (req, res) => {
  try {
    console.log(req.params.carVIN);
    const car = await cars.find({ VIN: req.params.carVIN });
    if (!car) res.status(404).send("No item found");
    res.status(200).send(car);
    console.log(car);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
});

app.post(
  "/updateCar",
  verifyToken,
  upload.array("images"),
  async (req, res) => {
    try {
      const data = req.body;

      const updatedCar = await cars.findOneAndUpdate(
        { VIN: req.body.VIN },
        data,
        {
          new: true,
        }
      );

      if (!updatedCar) {
        res.status(404).send("No car found");
      } else {
        res.status(200).send("Car updated");
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send(err);
    }
  }
);

module.exports = app;
