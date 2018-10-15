let shoppingItemTemplate =
    '<li class="js-shopping-item">' +
    '<p><span class="shopping-item js-shopping-item-name"></span><span class="shopping-item js-shopping-item-amount"></span></p>' +
    '<div class="shopping-item-controls">' +
    '<button class="js-shopping-item-toggle">' +
    '<span class="button-label">check</span>' +
    '</button>' +
    '<button class="js-shopping-item-delete">' +
    '<span class="button-label">delete</span>' +
    '</button>' +
    '</div>' +
    '</li>';

let recipeTemplate =
    '<div class="recipe js-recipe">' +
    '<h3 class="js-recipe-name recipe-name"><h3>' +
    '<h4 class="recipe-name">Ingredients</h4>' +
    '<ul class="js-recipe-ingredients recipe-ingredients">' +
    '</ul>' +
    '<h4 class="recipe-name">Instructions</h4>' +
    '<p class="js-recipe-instructions recipe-instructions"></p>' +
    '<div class="recipe-controls">' +
    '<button class="js-recipe-delete">' +
    '<span class="button-label delete-btn">delete</span>' +
    '</button>' +
    '</div>' +
    '</div>';

// let recipeOptionTemplate =
//     '<select name="recipe">' +
//     '<option value="js-recipe-name recipe-name">`${newRecipes}`</option>' +
//     '</select> <button type="button">Select</button>';

let serverBase = '//localhost:8080/';
let RECIPES_URL = serverBase + 'Recipes';
let SHOPPING_LIST_URL = serverBase + 'Shopping-List';

function getAndDisplayShoppingList() {
    console.log('Retrieving shopping list');
    $.getJSON(SHOPPING_LIST_URL, function (items) {
        let newItems = items.listItems;
        let itemElements = newItems.map(function (item) {
            let element = $(shoppingItemTemplate);
            element.attr('id', item.id);
            let itemName = element.find('.js-shopping-item-name');
            let itemAmount = element.find('.js-shopping-item-amount');
            itemName.text(item.ingredient);
            itemAmount.text(item.amount);
            element.attr('data-checked', item.checked);
            if (item.checked) {
                itemName.addClass('shopping-item__checked');
                itemAmount.addClass('shopping-item__checked');
            }
            return element;
        });
        $('.js-shopping-list').html(itemElements);
    });
}

function addShoppingItem(item) {
    console.log('Adding shopping item: ' + item);
    $.ajax({
        method: 'POST',
        url: SHOPPING_LIST_URL,
        data: JSON.stringify(item),
        success: function (data) {
            getAndDisplayShoppingList();
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function deleteShoppingItem(item) {
    console.log('DELETING ITEM ' + item);
    console.log(SHOPPING_LIST_URL + item);
    $.ajax({
        method: 'DELETE',
        url: SHOPPING_LIST_URL + '/' + item,
        success: getAndDisplayShoppingList
    });
}

function updateShoppingListitem(item) {
    console.log('Updating shopping list item `' + item.id + '`');
    $.ajax({
        url: SHOPPING_LIST_URL + '/' + item.id,
        method: 'PUT',
        data: JSON.stringify(item),
        success: function (data) {
            getAndDisplayShoppingList();
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function handleShoppingListAdd() {
    $('#js-shopping-list-form').submit(function (e) {
        e.preventDefault();
        addShoppingItem({
            ingredient: $(e.currentTarget)
                .find('#js-new-item')
                .val(),
            amount: $(e.currentTarget)
                .find('#js-new-amount')
                .val(),
            checked: false
        });
    });
}

function handleShoppingListDelete() {
    $('.js-shopping-list').on('click', '.js-shopping-item-delete', function (e) {
        e.preventDefault();
        deleteShoppingItem(
            $(e.currentTarget)
            .closest('.js-shopping-item')
            .attr('id')
        );
    });
}

function handleShoppingCheckedToggle() {
    $('.js-shopping-list').on('click', '.js-shopping-item-toggle', function (e) {
        console.log('CHECKED');
        e.preventDefault();
        let element = $(e.currentTarget).closest('.js-shopping-item');
        console.log('Element: ' + element.listItems);
        let item = {
            id: element.attr('id'),
            ingredient: element.find('.js-shopping-item-name').text(),
            checked: !JSON.parse(element.attr('data-checked'))
        };
        console.log('Update: ' + item);
        updateShoppingListitem(item);
    });
}

function addRecipe(recipe) {
    console.log('Adding recipe: ' + recipe);
    $.ajax({
        method: 'POST',
        url: RECIPES_URL,
        data: JSON.stringify(recipe),
        success: function (data) {
            getAndDisplayRecipes();
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function deleteRecipe(recipeId) {
    console.log("Deleting recipe `" + recipeId + "`");
    $.ajax({
        url: RECIPES_URL + "/" + recipeId,
        method: "DELETE",
        success: getAndDisplayRecipes
    });
}

// function displayRecipeOption() {
//     $.getJSON(RECIPES_URL, function (recipes) {
//         let recipesOptions = recipes.recipes;
//         let recipesElement = recipesOptions.map(function (recipe) {
//             let element = $(recipeOptionTemplate);
//             element.attr("id", recipe.id);
//             element.find(".js-recipe-name").text(recipe.recipeName);
//         });
//         $(".js-recipesOptions").html(recipesElement);
//     });
// }

function getAndDisplayRecipes() {
    console.log('Retrieving recipes');
    $.getJSON(RECIPES_URL, function (recipes) {
        let newRecipes = recipes.recipes;
        console.log('All Recipes: ' + `${newRecipes}`);
        let recipesElement = newRecipes.map(function (recipe) {
            // let ingredient = recipe;
            let element = $(recipeTemplate);
            element.attr("id", recipe.id);
            element.find(".js-recipe-name").text(recipe.recipeName);
            console.log('Recipe Name: ' + recipe.recipeName);
            console.log('Recipe ingredients: ' + recipe.ingredients);
            Object.keys(newRecipes).forEach(function (ingredient) {
                //     console.log("ingredient test1: " + recipe.ingredients);
                //     console.log("ingredient test2: " + element);
                console.log("ingredient test3: " + ingredient);
                let newIngredient = recipe.ingredients;
                console.log('Another Test: ' + newIngredient[ingredient]); // returns letters of ingredient
                console.log('Ingredients: ' + newIngredient);
                // let splitIngredient = newIngredient
                //     .split(',')
                //     .map(function (ingredient) {
                //         console.log('Ingredient5: ' + ingredient);

                //         return ingredient.trim();
                //     });
                // console.log('split: ' + splitIngredient);
                // element
                //     .find(".js-recipe-ingredients")
                //     .append("<li>" + newIngredient + "</li>");
                element.find(".js-recipe-instructions").text(recipe.instructions);
            });
            return element;
        });
        $(".js-recipes").html(recipesElement);
    });
}

function handleRecipeDelete() {
    $(".js-recipes").on("click", ".js-recipe-delete", function (e) {
        e.preventDefault();
        deleteRecipe(
            $(e.currentTarget)
            .closest(".js-recipe")
            .attr("id")
        );
    });
}

function handleRecipeAdd() {
    $('#js-recipe-form').submit(function (e) {
        e.preventDefault();
        let ingredients = $(e.currentTarget)
            .find('#ingredients-list')
            .val()
            .split(',')
            .map(function (ingredient) {
                console.log('Ingredient5: ' + ingredient);
                return ingredient.trim();
            });
        let instructions = $(e.currentTarget)
            .find('#instructions')
            .val();
        addRecipe({
            recipeName: $(e.currentTarget)
                .find('#recipe-name')
                .val(),
            ingredients: ingredients,
            instructions: instructions
        });
    });
}

// //  on page load do this
$(function () {
    getAndDisplayShoppingList();
    getAndDisplayRecipes();
    // displayRecipeOption();

    handleShoppingListAdd();
    handleShoppingListDelete();
    handleShoppingCheckedToggle();

    handleRecipeAdd();
    handleRecipeDelete();
});