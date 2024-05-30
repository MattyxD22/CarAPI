process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;
chai.use(chaiHttp);

const users = require("../models/userModel");
const server = require("../server");

const email = "testuser@test.com"


describe("Tests a single route in the userRoute.js file, as the other routes are tested in the initial setup", async()=>{
    it("Test if email matches in the database, to prevent duplicate emails in the system. NOT IMPLEMENTED", async()=>{
        const res = await chai.request(server).get("/api/users/checkEmail/" + email)
        expect(res).to.have.status(409)
        expect(res.body).to.not.be.null
    })

    it("Test if email doesnt match in the database, so a new user can be successfully created in the database. NOT IMPLEMENTED", async()=>{const res = await chai.request(server).get("/api/users/checkEmail/fakeEmail")
        expect(res).to.have.status(200)
        expect(res.body).to.not.be.null
    })
})