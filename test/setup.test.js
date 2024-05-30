process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

const fs = require("fs");
const path = require("path");

const cars = require("../models/carModel");
const users = require("../models/userModel");
const server = require("../server");

const newUser = {
  email: "testuser@test.com",
  password: "testUserPassword4E2ETesting",
};

const readAndParseJSON = (filePath) => {
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
};

const insertDataIntoDatabase = async (data) => {
  try {
    await cars.create(data);
  } catch (error) {
    console.error("Error inserting data into database:", error);
  }
};

//Clear test database before doing the testing, just in case
// Initial testing for ensuring communication with the database
before(async () => {
  await cars.deleteMany({});
  await users.deleteMany({});

  // read cars.json, format it and insert it into the database
  // Define path to JSON file
  const filePath = path.resolve(__dirname, "cars.json");
  // Read and parse the JSON file
  const jsonData = readAndParseJSON(filePath);
  // Insert the parsed data into database
  await insertDataIntoDatabase(jsonData);

  console.log("b Create");
  const createUserRes = await chai
    .request(server)
    .post("/api/users/createAccount")
    .send(newUser);
  expect(createUserRes).to.have.status(200);
  console.log("a Create");

  const loginRes = await chai
    .request(server)
    .post("/api/users/login")
    .send({ email: newUser.email, password: newUser.password });

  const authTokenCookie = loginRes.headers["set-cookie"].find((cookie) =>
    cookie.startsWith("auth-token=")
  );

  if (authTokenCookie) {
    const tokenValue = authTokenCookie.split(";")[0].split("=")[1];
    process.env.AUTH_TOKEN = tokenValue;
  } else {
    throw new Error("Auth token cookie was not found");
  }
});

//Also clears the test database after doing the testing
// after(async () => {
//   try {
//     await cars.deleteMany({});
//     await users.deleteMany({});
//   } catch (err) {
//     console.error("Error during setup:", err);
//     throw err;
//   }
// });
