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
            id: faker.random.alphaNumeric(),
            name: faker.name.title(),
            ingrediants: faker.random.arrayElement(),
            instructions: faker.lorem.paragraph()
        });
    }
    return Recipe.insertMany(seedData);
}

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
        it('should return recipes with right fields', function () {
            // Strategy: Get back all posts, and ensure they have expected keys

            let resRecipe;
            return chai.request(app)
                .get('/recipes')
                .then(function (res) {

                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.recipes).to.be.a('array');
                    expect(res.body.recipes).to.have.lengthOf.at.least(1);

                    // res.body.recipes.forEach(function (recipe) {
                    //     expect(recipe).to.be.a('object');
                    //     expect(recipe).to.include.keys('name', 'ingrediants', 'instructions');
                    // });
                    // check to make sure response data matches db data
                    resRecipe = res.body.recipes[0];
                    return Recipe.findById(resRecipe.id);
                })
                .then(recipe => {
                    expect(resRecipe.name).to.equal(recipe.name);
                    expect(resRecipe.ingrediants).to.equal(recipe.ingrediants);
                    expect(resRecipe.instructions).to.equal(recipe.instructions);
                });
        });
    });
    describe('POST endpoint', function () {
        // make a post request and get the data back
        it('should add a new recipe', function () {

            const newRecipe = {
                name: faker.name.title(),
                ingrediants: [{
                    item: faker.random.word(),
                    item: faker.random.word(),
                }],
                instructions: faker.lorem.paragraph()
            };

            return chai.request(app)
                .post('/recipes')
                .send(newRecipe)
                .then(function (res) {
                    console.log(newRecipe);
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys(
                        'id', 'name', 'ingrediants', 'instructions');
                    expect(res.body.name).to.equal(newRecipe.name);
                    expect(res.body.id).to.not.be.null;
                    expect(res.body.ingrediants).to.equal(newRecipe.ingrediants);
                    expect(res.body.instructions).to.equal(newRecipe.instructions);
                    return REcipe.findById(res.body.id);
                })
                .then(function (recipe) {
                    expect(recipe.name).to.equal(newRecipe.name);
                    expect(recipe.ingrediants).to.equal(newRecipe.ingrediants);
                    expect(recipe.instructions).to.equal(newRecipe.instructions);
                });
        });
    });
});