const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require('faker');
const mongoose = require('mongoose');
const {
    User
} = require('../users');

const jwt = require('jsonwebtoken');

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
    JWT_SECRET,
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
            username: faker.random.word(),
            ingredient: faker.random.arrayElement()
        });
    }
    return ShoppingList.insertMany(seedData);
}

function generateShoppingList() {
    return {
        username: faker.random.word(),
        ingredient: faker.random.arrayElement()
    };
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}


//api end point tests
describe('shopping list API resource', function () {
    const username = 'exampleUser';
    const password = 'examplePass';
    const email = 'example@example.com';
    const firstName = 'Example';
    const lastName = 'User';

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
            const token = jwt.sign({
                    user: {
                        username,
                        email,
                        firstName,
                        lastName
                    }
                },
                JWT_SECRET, {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );
            return chai.request(app)
                .get('/Shopping-List')
                .set('Authorization', `Bearer ${token}`)
                .then(function (res) {
                    expect(res).to.have.status(200);
                })
        });
        it('should return shopping list with right fields', function () {
            const token = jwt.sign({
                    user: {
                        username,
                        email,
                        firstName,
                        lastName
                    }
                },
                JWT_SECRET, {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );
            // Strategy: Get back all posts, and ensure they have expected keys

            let resShoppingList;
            return chai.request(app)
                .get('/Shopping-List')
                .set('Authorization', `Bearer ${token}`)
                .then(function (res) {

                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.listItems).to.be.a('array');
                    expect(res.body.listItems).to.have.lengthOf.at.least(1);

                    res.body.listItems.forEach(function (listItem) {
                        expect(listItem).to.be.a('object');
                        expect(listItem).to.include.keys('ingredient');
                    });
                    // check to make sure response data matches db data
                    resShoppingList = res.body.listItems[0];
                    return ShoppingList.findById(resShoppingList.id);
                })
                .then(listItem => {
                    expect(resShoppingList.ingredient).to.equal(listItem.ingredient);
                });
        });
    });
    describe('POST endpoint', function () {
        it('should add a new List Item', function () {
            const token = jwt.sign({
                    user: {
                        username,
                        email,
                        firstName,
                        lastName
                    }
                },
                JWT_SECRET, {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );

            const newListItem = generateShoppingList();

            return chai.request(app)
                .post('/Shopping-List')
                .set('Authorization', `Bearer ${token}`)
                .send(newListItem)
                .then(function (res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys(
                        'ingredient');
                    expect(res.body.id).to.not.be.null;
                    expect(res.body.ingredient).to.equal(newListItem.ingredient);
                    return ShoppingList.findById(res.body.id);
                })
                .then(function (listItem) {
                    expect(listItem.ingredient).to.equal(newListItem.ingredient);
                });
        });
    });

    describe('PUT endpoint', function () {
        //  need to get a List Item from the db
        // update that List Item from the id
        // check data
        it('should update fields you send over', function () {
            const token = jwt.sign({
                    user: {
                        username,
                        email,
                        firstName,
                        lastName
                    }
                },
                JWT_SECRET, {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );
            const updateData = {
                ingredient: faker.random.arrayElement()
            };

            return ShoppingList
                .findOne()
                .then(listItem => {
                    updateData.id = listItem.id;

                    return chai.request(app)
                        .put(`/Shopping-List/${listItem.id}`)
                        .set('Authorization', `Bearer ${token}`)
                        .send(updateData);
                })
                .then(res => {
                    expect(res).to.have.status(204);
                    return ShoppingList.findById(updateData.id);
                })
                .then(listItem => {
                    expect(listItem.ingredient).to.equal(updateData.ingredient);
                });
        });
    });

    describe('DELETE endpoint', function () {
        //  get a List Item to retreive the id
        // delete that id
        it('should delete a List Item by id', function () {
            const token = jwt.sign({
                    user: {
                        username,
                        email,
                        firstName,
                        lastName
                    }
                },
                JWT_SECRET, {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );

            let item;

            return ShoppingList
                .findOne()
                .then(_item => {
                    item = _item;
                    console.log('Testing: ' + item);
                    return chai.request(app).delete(`/Shopping-List/${item.id}`)
                        .set('Authorization', `Bearer ${token}`);

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