const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv-flow").config();
const mongoose = require("mongoose");
console.log(process.env.DB_URI.split(":")[2].substring(0,3));
mongoose.connect(process.env.DB_URI);
const cookieParser = require("cookie-parser");

const swaggerUI = require("swagger-ui-express");
const yamlJS = require("yamljs");

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cookieParser());

// Use built-in middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const PORT = process.env.PORT || 3000;

// Define routes
const carsRoute = require("./routes/carRoute");
const usersRoute = require("./routes/userRoute");

app.use("/api/cars", carsRoute);
app.use("/api/users", usersRoute);

const swaggerDefinition = yamlJS.load("./swagger.yaml");
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDefinition));



app.listen(PORT, async () => {
  console.log("Server Listening on PORT:", PORT);
});
app.get("/api/health-check", (req, res) => {
  res.status(200).send({ message: "Health check was successful!" });
});

module.exports = app