const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {
    Recipes,
    ShoppingList
} = require('../models');

chai.use(chaiHttp);

// test that shows it returns a 200 status for each route

describe("shopping-list page", function () {
    it("should exist", function () {
        return chai
            .request(app)
            .get("/shopping-list.html")
            .then(function (res) {
                expect(res).to.have.status(200);
            });
    });
});

describe("login page", function () {
    it("should exist", function () {
        return chai
            .request(app)
            .get("/login.html")
            .then(function (res) {
                expect(res).to.have.status(200);
            });
    });
});
describe("recipes page", function () {
    it("should exist", function () {
        return chai
            .request(app)
            .get("/recipes.html")
            .then(function (res) {
                expect(res).to.have.status(200);
            });
    });
});

// describe('GET endpoint', function () {
//     it('should return all existing recipes', function () {
//         return chai.request(app)
//             .get('/recipes')
//             .then(function (res) {
//                 expect(res).to.have.status(200);
//             })
//     });
// });