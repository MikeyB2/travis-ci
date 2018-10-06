const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {
    Recipe,
    ShoppingList
} = require('../models');
const {
    closeServer,
    runServer,
    app
} = require('../server');
const {
    TEST_DATABASE_URL
} = require('../config');

chai.use(chaiHttp);

// create seed data
function seedRecipeData() {
    console.info('seeding recipe data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            name: faker.name.title(),
            ingrediants: faker.random.arrayElement(),
            instructions: faker.lorem.paragraph()
        });
    }
    return Recipe.insertMany(seedData);
}

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

//api end point tests
describe('recipe API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedRecipeData();
    });

    afterEach(function () {});

    after(function () {
        return closeServer();
    });
    describe('GET endpoint', function () {
        it('should return all existing recipes', function () {
            return chai.request(app)
                .get('/recipes')
                .then(function (res) {
                    console.log("TESTING:" + res);
                    expect(res).to.have.status(200);
                })
        });
    });
});