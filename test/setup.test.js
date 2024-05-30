process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const cars = require("../models/carModel");
const users = require("../models/userModel");
const server = require("../server");

before(async () => {
    try {
      await cars.deleteMany({});
      await users.deleteMany({});
  
      let newUser = {
        email: "testuser@test.com",
        password: "testUserPassword4E2ETesting",
      };
  
      const resCreate = await chai.request(server).post("/api/users/createAccount").send(newUser);
      console.log('Create User Response:', resCreate.body);
  
      const resLogin = await chai.request(server).post("/api/users/login").send({
        email: newUser.email,
        password: newUser.password,
      });
      console.log('Login Response:', resLogin.body);
  
      const authTokenCookie = resLogin.headers["set-cookie"].find((cookie) =>
        cookie.startsWith("auth-token=")
      );
  
      if (authTokenCookie) {
        const tokenValue = authTokenCookie.split(";")[0].split("=")[1];
        process.env.AUTH_TOKEN = tokenValue;
      } else {
        throw new Error("Auth token cookie was not found");
      }
    } catch (err) {
      console.error("Error during setup:", err);
      throw err;
    }
  });
