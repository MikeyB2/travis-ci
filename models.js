'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let MOCK_SHOPPING_LIST = {
    "shoppingList": [{
            "id": "1111111",
            "ingrediant": "Onion",
            "amount": "1",
            "unit": "each"
        },
        {
            "id": "2222222",
            "ingrediant": "milk",
            "amount": "1",
            "unit": "gal"
        },
        {
            "id": "333333",
            "ingrediant": "ketchup",
            "amount": "1",
            "unit": "each"
        },
        {
            "id": "4444444",
            "ingrediant": "syrup",
            "amount": "1",
            "unit": "tbs"
        }
    ]
};

let MOCK_RECIPES = {
    "recipes": [{
            "id": "1111111",
            "name": "milk shake",
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
            "name": "smoothie",
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
    recipes: [{
        name: String,
        ingrediants: Array,
        instructions: String //paragraph a steps
    }]
});


recipeSchema.methods.serialize = function () {
    return {
        id: this._id,
        name: this.name,
        ingrediants: this.ingrediants,
        instructions: this.instructions,
    };
};

const Recipe = mongoose.model('Recipes', recipeSchema);

module.exports = {
    Recipe
};