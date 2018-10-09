const express = require("express");
const router = express.Router();

const {
    ShoppingList
} = require("./models");



router.get("/", (req, res) => {
    res.json(ShoppingList.get());
});




module.exports = router;