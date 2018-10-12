'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

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
    }, //paragraph of steps
    checked: {
        type: Boolean
    }

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