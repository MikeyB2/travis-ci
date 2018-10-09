'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const {
    app,
    runServer,
    closeServer
} = require('../server');
const {
    User
} = require('../users');
const {
    JWT_SECRET,
    TEST_DATABASE_URL
} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);