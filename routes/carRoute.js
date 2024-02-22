const express = require("express");
const cars = require("../models/carModel");
const app = express();
const multer = require("multer");
const verifyToken = require("../auth");

//use multer to create temporary storage and add ability to upload images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", async (req, res) => {
  //console.log("request recieved", req);
  try {
    const car = await cars.find({});
    if (!car) res.status(404).send("No item found");

    res.status(200).send(car);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/carVIN/:carVIN", async (req, res) => {
  try {
    const car = await cars.find({ VIN: req.params.carVIN });
    if (!car) res.status(404).send("No item found");
    res.status(200).send(car);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
});

app.put("/updateCar", verifyToken, upload.array("images"), async (req, res) => {
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
    res.status(500).send(err.message);
  }
});

app.post("/newCar", verifyToken, upload.array("images"), async (req, res) => {
  try {
    const car = req.body;

    await cars.create(car);

    console.log(car);

    res.status(200).json({ Message: "Car added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error when posting a new car", message: error.message });
  }
});

app.delete("/deleteCar", verifyToken, async (req, res) => {
  try {
    const carVin = req.body.VIN;
    console.log(carVin);

    const carToDelete = await cars.findOneAndDelete({ VIN: carVin });

    if (!carToDelete) {
      res.status(404).json({ Message: "No car found" });
    } else {
      res.status(200).json({ Message: "Car deleted" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error when deleting a car", message: error.message });
  }
});

module.exports = app;
