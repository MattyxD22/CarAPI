process.env.NODE_ENV = "test";
const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;
chai.use(chaiHttp);

const cars = require("../models/carModel");
const server = require("../server");

const newCar = {
    Make: "Peugeot",
    Model: "206",
    Year: 2006,
    VIN: "SP3c14lP3u630tV1N",
    Description: "The 2006 Peugeot 206 embodies sophistication and efficiency. Its sleek design merges with reliable performance, offering a comfortable ride and impressive fuel economy. With advanced safety features and modern amenities, it ensures a delightful driving experience."
}

const carVIN = "JTHCL5EF2F5404894"

describe("Tests all routes in the carRoute.js file", async()=>{

    it("should retreive all cars and show 200 OK", async()=>{
        const res = await chai.request(server).get("/api/cars/getAllCars")
        expect(res).to.have.status(200)
        expect(res.body.cars).to.not.be.null
    })

    it("Test if a car can be found based on a existing VIN", async()=>{
        const res = await chai.request(server).get("/api/cars/carVIN/"+carVIN)
        expect(res).to.have.status(200)
        expect(res.body).to.not.be.null
    })

    it("Test if a car cannot be found based on a false VIN", async()=>{
        const res = await chai.request(server).get("/api/cars/carVIN/fakeVIN")
        expect(res).to.have.status(404)
        expect(res.body).to.not.be.null
    })

    it("Should test if a new car can be created", async()=>{
        const res = await chai.request(server)
        .post('/api/cars/newCar')
        .set('Cookie', `auth-token=${process.env.AUTH_TOKEN}`)
        .send(newCar);
        expect(res).to.have.status(200);
    })

    
    it("Should test if a new car can be created", async()=>{

        newCar.Model = "308sw";
        newCar.Year = "2016"
        newCar.Description = "The 2016 Peugeot 308SW blends elegant design with practicality. Featuring spacious interiors and innovative technology, it offers a refined driving experience. With fuel efficiency and modern safety features, it's ideal for urban adventures and family journeys alike.";

        const res = await chai.request(server)
        .post('/api/cars/newCar')
        .set('Cookie', `auth-token=${process.env.AUTH_TOKEN}`)
        .send(newCar);
        expect(res).to.have.status(200);
    })

    

    it("Should test if a car can be deleted from the VIN", async()=>{
        const res = await chai.request(server)
        .delete('/api/cars/deleteCar')
        .set('Cookie', `auth-token=${process.env.AUTH_TOKEN}`)
        .send({VIN: newCar.VIN});
        expect(res).to.have.status(200);
    })



})