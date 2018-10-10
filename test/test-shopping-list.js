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
            amount: faker.random.word()
        });
    }
    return ShoppingList.insertMany(seedData);
}

function generateShoppingList() {
    return {
        ingrediant: faker.random.arrayElement(),
        amount: faker.random.word()
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
                    expect(res.body.listItems).to.be.a('array');
                    expect(res.body.listItems).to.have.lengthOf.at.least(1);

                    res.body.listItems.forEach(function (listItem) {
                        expect(listItem).to.be.a('object');
                        expect(listItem).to.include.keys('ingrediant', 'amount');
                    });
                    // check to make sure response data matches db data
                    resShoppingList = res.body.listItems[0];
                    return ShoppingList.findById(resShoppingList.id);
                })
                .then(listItem => {
                    expect(resShoppingList.ingrediant).to.equal(listItem.ingrediant);
                    expect(resShoppingList.amount).to.equal(listItem.amount);
                });
        });
    });
    describe('POST endpoint', function () {
        it('should add a new List Item', function () {

            const newListItem = generateShoppingList();

            return chai.request(app)
                .post('/Shopping-List')
                .send(newListItem)
                .then(function (res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys(
                        'ingrediant', 'amount');
                    expect(res.body.id).to.not.be.null;
                    expect(res.body.ingrediant).to.equal(newListItem.ingrediant);
                    expect(res.body.amount).to.equal(newListItem.amount);
                    return ShoppingList.findById(res.body.id);
                })
                .then(function (listItem) {
                    expect(listItem.ingrediant).to.equal(newListItem.ingrediant);
                    expect(listItem.amount).to.equal(newListItem.amount);
                });
        });
    });

    describe('PUT endpoint', function () {
        //  need to get a List Item from the db
        // update that List Item from the id
        // check data
        it('should update fields you send over', function () {
            const updateData = {
                ingrediant: faker.random.arrayElement(),
                amount: faker.random.word()
            };

            return ShoppingList
                .findOne()
                .then(listItem => {
                    updateData.id = listItem.id;

                    return chai.request(app)
                        .put(`/Shopping-List/${listItem.id}`)
                        .send(updateData);
                })
                .then(res => {
                    expect(res).to.have.status(204);
                    return ShoppingList.findById(updateData.id);
                })
                .then(listItem => {
                    expect(listItem.ingrediant).to.equal(updateData.ingrediant);
                    expect(listItem.amount).to.equal(updateData.amount);
                });
        });
    });

    describe('DELETE endpoint', function () {
        //  get a List Item to retreive the id
        // delete that id
        it('should delete a List Item by id', function () {

            let item;

            return ShoppingList
                .findOne()
                .then(_item => {
                    item = _item;
                    console.log('Testing: ' + item);
                    return chai.request(app).delete(`/Shopping-List/${item.id}`);

                })
                .then(res => {
                    console.log("Res: " + item.id)
                    expect(res).to.have.status(204);
                    return ShoppingList.findById(item.id);
                })
                .then(_item => {
                    console.log('TEST: ' + _item);
                    expect(_item).to.be.null;
                });
        });
    });



});