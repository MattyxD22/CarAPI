const { MongoClient, ServerApiVersion } = require("mongodb");
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

console.log(DB_USER, DB_PASS, "");

const uri =
  "mongodb+srv://" +
  DB_USER +
  ":" +
  DB_PASS +
  "@carcluser.x5aknry.mongodb.net/?retryWrites=true&w=majority";
console.log(uri);
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// const PORT = process.env.PORT || 8000;

// // app.use("/user", userRoute);
// // app.use("/kontrol", kontrolRoute);
// // app.use("/export", exportRoute);

// app.listen(PORT, () => {
//   console.log("Server Listening on PORT:", PORT);
// });

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("db_carapi").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
