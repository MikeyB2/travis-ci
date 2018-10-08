const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {
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
function seedShoppingListData() {
    console.info('seeding shopping list data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push({
            id: faker.random.alphaNumeric(),
            ingrediant: faker.random.arrayElement(),
            amount: faker.random.number()
        });
    }
    return ShoppingList.insertMany(seedData);
}

function generateShoppingList() {
    return {
        ingrediant: faker.random.arrayElement(),
        amount: faker.random.number()
    };
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}


//api end point tests
describe('shopping list API resource', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedShoppingListData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    describe('GET endpoint', function () {
        it('should return all existing shopping list items', function () {
            return chai.request(app)
                .get('/Shopping-List')
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
        });
        it('should return shopping list with right fields', function () {
            // Strategy: Get back all posts, and ensure they have expected keys

            let resShoppingList;
            return chai.request(app)
                .get('/Shopping-List')
                .then(function (res) {

                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.listItems).to.be.a('object');
                    expect(res.body.listItems).to.have.lengthOf.at.least(1);

                    res.body.listItems.forEach(function (recipe) {
                        expect(listItem).to.be.a('object');
                        expect(listItem).to.include.keys('ingrediant', 'amount');
                    });
                    // check to make sure response data matches db data
                    resShoppingList = res.body.recipes[0];
                    return ShoppingList.findById(resShoppingList.id);
                })
                .then(recipe => {
                    expect(resShoppingList.ingrediant).to.equal(listItem.ingrediant);
                    expect(resShoppingList.amount).to.equal(listItem.amount);
                });
        });
    });


});