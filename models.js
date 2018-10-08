'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let MOCK_SHOPPING_LIST = {
    "shoppingList": [{
            "id": "1111111",
            "ingrediant": "Onion",
            "amount": "1",
        },
        {
            "id": "2222222",
            "ingrediant": "milk",
            "amount": "1",
        },
        {
            "id": "333333",
            "ingrediant": "ketchup",
            "amount": "1",
        },
        {
            "id": "4444444",
            "ingrediant": "syrup",
            "amount": "1",
        }
    ]
};

let MOCK_RECIPES = {
    "recipes": [{
            "id": "1111111",
            "recipeName": "milk shake",
            "ingrediants": [{
                    "amount": "2 tbs",
                    "item": "Chocolate Syrup"
                },
                {
                    "amount": "3 cups",
                    "item": "milk"
                },
                {
                    "amount": "1",
                    "item": "Glass"
                },
            ],
            "instructions": "list of steps"
        },
        {
            "id": "2222222",
            "recipeName": "smoothie",
            "ingrediants": [{
                    "amount": "2 cups",
                    "item": "strawberries"
                },
                {
                    "amount": "3 cups",
                    "item": "milk"
                },
                {
                    "amount": "1",
                    "item": "banana"
                },
                {
                    "amount": "1",
                    "item": "Glass"
                },
            ],
            "instructions": "list of steps"
        }
    ]
};

const recipeSchema = mongoose.Schema({
    recipeName: {
        type: String
    },
    ingrediants: {
        type: String
    },
    instructions: {
        type: String
    } //paragraph of steps

});


recipeSchema.methods.serialize = function () {
    return {
        id: this._id,
        recipeName: this.recipeName,
        ingrediants: this.ingrediants,
        instructions: this.instructions,
    };
};

const shoppingListSchema = mongoose.Schema({
    ingrediant: {
        type: String
    },
    amount: {
        type: String
    } //paragraph of steps

});


shoppingListSchema.methods.serialize = function () {
    return {
        id: this._id,
        ingrediant: this.ingrediant,
        amount: this.amount,
    };
};

const Recipe = mongoose.model('Recipes', recipeSchema);
const ShoppingList = mongoose.model('Shopping-List', shoppingListSchema);

module.exports = {
    Recipe,
    ShoppingList
};