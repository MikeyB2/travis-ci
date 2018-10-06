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