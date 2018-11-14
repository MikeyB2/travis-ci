'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const passport = require('passport');

const createAuthToken = function (user) {
    return jwt.sign({
        user
    }, config.JWT_SECRET, {
            subject: user.username,
            expiresIn: config.JWT_EXPIRY,
            algorithm: 'HS256'
        });
};
const localAuth = passport.authenticate('local', {
    session: false
});
const {
    User
} = require('./models');


const router = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new user
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['username', 'password', 'email'];
    const missingField = requiredFields.find(field => !(field in req.body));
    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    const stringFields = ['username', 'password', 'email', 'firstName', 'lastName'];
    const nonStringField = stringFields.find(
        field => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected string',
            location: nonStringField
        });
    }

    const explicityTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicityTrimmedFields.find(
        field => req.body[field].trim() !== req.body[field]
    );

    if (nonTrimmedField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with whitespace',
            location: nonTrimmedField
        });
    }

    const sizedFields = {
        username: {
            min: 6,
            max: 20
        },
        password: {
            min: 8,
            max: 72
        }
    };
    const tooSmallField = Object.keys(sizedFields).find(
        field =>
            'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(
        field =>
            'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField ?
                `Must be at least ${sizedFields[tooSmallField]
                    .min} characters long` : `Must be at most ${sizedFields[tooLargeField]
                        .max} characters long`,
            location: tooSmallField || tooLargeField
        });
    }

    let {
        username,
        password,
        email,
        firstName,
        lastName
    } = req.body;
    email = email.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();

    return User.find({
        username
    })
        .count()
        .then(count => {
            if (count > 0) {
                // There is an existing user with the same username
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already taken',
                    location: 'username'
                });
            }
            // If there is no existing user, hash the password
            return User.hashPassword(password);
        })
        .then(hash => {
            return User.create({
                username,
                password: hash,
                email,
                firstName,
                lastName
            });
        })
        .then(user => {
            return res.status(201).json(user.serialize());

        })
        .catch(err => {
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({
                code: 500,
                message: 'Internal server error'
            });
        });
});

router.get('/', (req, res) => {
    return User.find()
        .then(users => res.json(users.map(user => user.serialize())))
        .catch(err => res.status(500).json({
            message: 'Internal server error'
        }));
});

module.exports = {
    router
};