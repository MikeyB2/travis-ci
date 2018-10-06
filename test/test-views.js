const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;

const {
    Recipe,
    ShoppingList
} = require('../models');
const {
    app
} = require('../server');
const {
    TEST_DATABASE_URL
} = require('../config');

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

describe("Meals page", function () {
    it("should exist", function () {
        return chai
            .request(app)
            .get("/meals.html")
            .then(function (res) {
                expect(res).to.have.status(200);
            });
    });
});