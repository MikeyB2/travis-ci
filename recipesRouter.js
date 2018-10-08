const express = require("express");
const router = express.Router();

const {
    Recipe
} = require("./models");



router.get("/", (req, res) => {
    res.json(Recipe.get());
});