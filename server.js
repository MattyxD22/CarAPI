const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv-flow").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URI);

const swaggerUI = require("swagger-ui-express");
const yamlJS = require("yamljs");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser({ limit: "100mb" }));
app.use(bodyParser.json());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.options("*", cors());
//app.use(cors(corsOptions));
app.use(cors());

const PORT = process.env.PORT || 3000;

//Define routes
const carsRoute = require("./routes/carRoute");
const usersRoute = require("./routes/userRoute");

// // app.use("/kontrol", kontrolRoute);
// // app.use("/export", exportRoute);



app.use("/api/cars", carsRoute);
app.use("/api/users", usersRoute);

app.get("/api/health-check", (req, res) => {
  res.status(200).send({ message: "Health check was successful!" });
});

app.listen(PORT, async () => {
  console.log("Server Listening on PORT:", PORT);
});

const swaggerDefinition = yamlJS.load("./swagger.yaml");
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDefinition));

console.log(123)
