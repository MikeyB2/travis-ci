'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let MOCK_SHOPPING_LIST = {
    "shoppingList": [{
            "id": "1111111",
            "ingredient": "Onion",
            "amount": "1",
        },
        {
            "id": "2222222",
            "ingredient": "milk",
            "amount": "1",
        },
        {
            "id": "333333",
            "ingredient": "ketchup",
            "amount": "1",
        },
        {
            "id": "4444444",
            "ingredient": "syrup",
            "amount": "1",
        }
    ]
};

let MOCK_RECIPES = {
    "recipes": [{
            "id": "1111111",
            "recipeName": "milk shake",
            "ingredients": [{
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
            "ingredients": [{
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
    ingredients: {
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
        ingredients: this.ingredients,
        instructions: this.instructions,
    };
};

const shoppingListSchema = mongoose.Schema({
    ingredient: {
        type: String
    },
    amount: {
        type: String
    } //paragraph of steps

});


shoppingListSchema.methods.serialize = function () {
    return {
        id: this._id,
        ingredient: this.ingredient,
        amount: this.amount,
    };
};

const Recipe = mongoose.model('Recipes', recipeSchema);
const ShoppingList = mongoose.model('Shopping-List', shoppingListSchema);

module.exports = {
    Recipe,
    ShoppingList
};