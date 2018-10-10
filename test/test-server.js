const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {
    Recipe,
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
        seedData.push(generateRecipe());
    }
    return Recipe.insertMany(seedData);
}

function generateRecipe() {
    return {
        // id: faker.random.alphaNumeric(),
        recipeName: faker.name.title(),
        ingredients: faker.random.arrayElement(),
        instructions: faker.lorem.paragraph()
    };
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

//api end point tests
describe('recipe API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedRecipeData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });
    describe('GET endpoint', function () {
        it('should return all existing recipes', function () {
            return chai.request(app)
                .get('/recipes')
                .then(function (res) {
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

                    res.body.recipes.forEach(function (recipe) {
                        expect(recipe).to.be.a('object');
                        expect(recipe).to.include.keys('recipeName', 'ingredients', 'instructions');
                    });
                    // check to make sure response data matches db data
                    resRecipe = res.body.recipes[0];
                    return Recipe.findById(resRecipe.id);
                })
                .then(recipe => {
                    expect(resRecipe.recipeName).to.equal(recipe.recipeName);
                    expect(resRecipe.ingredients).to.equal(recipe.ingredients);
                    expect(resRecipe.instructions).to.equal(recipe.instructions);
                });
        });
    });


    describe('POST endpoint', function () {
        it('should add a new recipe', function () {

            const newRecipe = generateRecipe();

            return chai.request(app)
                .post('/recipes')
                .send(newRecipe)
                .then(function (res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys(
                        'recipeName', 'ingredients', 'instructions');
                    expect(res.body.recipeName).to.equal(newRecipe.recipeName);
                    expect(res.body.id).to.not.be.null;
                    expect(res.body.ingredients).to.equal(newRecipe.ingredients);
                    expect(res.body.instructions).to.equal(newRecipe.instructions);
                    return Recipe.findById(res.body.id);
                })
                .then(function (recipe) {
                    expect(recipe.recipeName).to.equal(newRecipe.recipeName);
                    expect(recipe.ingredients).to.equal(newRecipe.ingredients);
                    expect(recipe.instructions).to.equal(newRecipe.instructions);
                });
        });
    });
    describe('DELETE endpoint', function () {
        //  get a recipe to retreive the id
        // delete that id
        it('should delete a recipe by id', function () {

            let recipe;

            return Recipe
                .findOne()
                .then(_recipe => {
                    recipe = _recipe;
                    return chai.request(app).delete(`/recipes/${recipe.id}`);
                })
                .then(res => {
                    console.log("Res: " + recipe.id)
                    expect(res).to.have.status(204);
                    return Recipe.findById(recipe.id);
                })
                .then(_post => {
                    console.log('TESTING RECIPE: ' + _post);
                    expect(_post).to.be.null;
                });
        });
    });
    describe('PUT endpoint', function () {
        //  need to get a recipe from the db
        // update that recipe from the id
        // check data
        it('should update fields you send over', function () {
            const updateData = {
                recipeName: faker.name.title(),
                ingredients: faker.random.arrayElement(),
                instructions: faker.lorem.paragraph()
            };

            return Recipe
                .findOne()
                .then(recipe => {
                    updateData.id = recipe.id;

                    return chai.request(app)
                        .put(`/recipes/${recipe.id}`)
                        .send(updateData);
                })
                .then(res => {
                    expect(res).to.have.status(204);
                    return Recipe.findById(updateData.id);
                })
                .then(recipe => {
                    expect(recipe.recipeName).to.equal(updateData.recipeName);
                    expect(recipe.ingredients).to.equal(updateData.ingredients);
                    expect(recipe.instructions).to.equal(updateData.instructions);
                });
        });
    });

});