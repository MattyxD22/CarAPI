require("dotenv-flow").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const yamlJS = require("yamljs");

const app = express();
app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors());


mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define routes
const carsRoute = require("./routes/carRoute");
const usersRoute = require("./routes/userRoute");
app.use("/api/cars", carsRoute);
app.use("/api/users", usersRoute);


const swaggerDefinition = yamlJS.load("./swagger.yaml");
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDefinition));


app.get("/api/health-check", (req, res) => {
  res.status(200).send({ message: "Health check was successful!" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server listening on PORT:", PORT);
});

module.exports = app;
