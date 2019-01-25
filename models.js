'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const recipeSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    recipeName: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    instructions: {
        type: String
    } //paragraph of steps

});


recipeSchema.methods.serialize = function () {
    return {
        id: this._id,
        username: this.username,
        recipeName: this.recipeName,
        ingredients: this.ingredients,
        instructions: this.instructions,
    };
};

const shoppingListSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    ingredient: {
        type: String,
        required: true
    },
    amount: {
        type: String
    }
});


shoppingListSchema.methods.serialize = function () {
    return {
        id: this._id,
        username: this.username,
        ingredient: this.ingredient,
        amount: this.amount,
    };
};

const mealsSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    meal: {
        type: String,
        required: true
    },
    recipe: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    }
});

mealsSchema.methods.serialize = function () {
    return {
        id: this._id,
        username: this.username,
        meal: this.meal,
        recipe: this.recipe,
        day: this.day,
    };
};

const Meals = mongoose.model('Meals', mealsSchema);
const Recipe = mongoose.model('Recipes', recipeSchema);
const ShoppingList = mongoose.model('Shopping-List', shoppingListSchema);

module.exports = {
    Recipe,
    ShoppingList,
    Meals
};