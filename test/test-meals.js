const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {
    Meals
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
function seedMealsData() {
    console.info('seeding meals data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            id: faker.random.alphaNumeric(),
            meal: faker.name.firstName(),
            recipe: faker.name.lastName()
        });
    }
    return Meals.insertMany(seedData);
}

function generateMeal() {
    return {
        meal: faker.name.firstName(),
        recipe: faker.name.lastName()
    };
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

//api end point tests
describe('meals API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedMealsData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    describe('GET endpoint', function () {
        it('should return all existing meals', function () {
            return chai.request(app)
                .get('/Meals')
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
        });
        it('should return meals with right fields', function () {
            // Strategy: Get back all posts, and ensure they have expected keys

            let resMeals;
            return chai.request(app)
                .get('/Meals')
                .then(function (res) {

                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.meals).to.be.a('array');
                    expect(res.body.meals).to.have.lengthOf.at.least(1);

                    res.body.meals.forEach(function (meal) {
                        expect(meal).to.be.a('object');
                        expect(meal).to.include.keys('meal', 'recipe');
                    });
                    // check to make sure response data matches db data
                    resMeals = res.body.meals[0];
                    return Meals.findById(resMeals.id);
                })
                .then(meals => {
                    expect(resMeals.meal).to.equal(meals.meal);
                    expect(resMeals.recipe).to.equal(meals.recipe);
                });
        });
    });
    describe('POST endpoint', function () {
        it('should add a new Meal', function () {

            const newMeal = generateMeal();

            return chai.request(app)
                .post('/Meals')
                .send(newMeal)
                .then(function (res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys(
                        'meal', 'recipe');
                    expect(res.body.id).to.not.be.null;
                    expect(res.body.meal).to.equal(newMeal.meal);
                    expect(res.body.recipe).to.equal(newMeal.recipe);
                    return Meals.findById(res.body.id);
                })
                .then(function (meals) {
                    expect(meals.meal).to.equal(newMeal.meal);
                    expect(meals.recipe).to.equal(newMeal.recipe);
                });
        });
    });

    describe('PUT endpoint', function () {
        //  need to get a Meal from the db
        // update that Meal from the id
        // check data
        it('should update fields you send over', function () {
            const updateData = {
                meal: faker.name.firstName(),
                recipe: faker.name.lastName()
            };

            return Meals
                .findOne()
                .then(meal => {
                    updateData.id = meal.id;

                    return chai.request(app)
                        .put(`/Meals/${meal.id}`)
                        .send(updateData);
                })
                .then(res => {
                    expect(res).to.have.status(204);
                    return Meals.findById(updateData.id);
                })
                .then(meals => {
                    expect(meals.meal).to.equal(updateData.meal);
                    expect(meals.recipe).to.equal(updateData.recipe);
                });
        });
    });

    describe('DELETE endpoint', function () {
        //  get a List Item to retreive the id
        // delete that id
        it('should delete a Meal by id', function () {

            let item;

            return Meals
                .findOne()
                .then(_item => {
                    item = _item;
                    console.log('Testing: ' + item);
                    return chai.request(app).delete(`/Meals/${item.id}`);

                })
                .then(res => {
                    console.log("Res: " + item.id)
                    expect(res).to.have.status(204);
                    return Meals.findById(item.id);
                })
                .then(_item => {
                    console.log('TEST: ' + _item);
                    expect(_item).to.be.null;
                });
        });
    });



});