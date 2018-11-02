let shoppingItemTemplate =
    '<li class="js-shopping-item">' +
    '<p><span class="shopping-item js-shopping-item-name"></span><span class="shopping-item js-shopping-item-amount"></span>' +
    // '<div class="shopping-item-controls">' +
    '<button class="js-shopping-item-delete delete-btn">' +
    '<span class="button-label">Delete | Done</span>' +
    '</button>' +
    // '</div>' +
    '</p>' +
    '</li>';

let recipeTemplate =
    '<div class="recipe js-recipe">' +
    '<h3 class="js-recipe-name recipe-name"><h3>' +
    '<h4 class="ingredients">Ingredients</h4>' +
    '<ul class="js-recipe-ingredients recipe-ingredients">' +
    '</ul>' +
    '<h4 class="instructions">Instructions</h4>' +
    '<p class="js-recipe-instructions recipe-instructions"></p>' +
    '<div class="recipe-controls">' +
    '<button class="js-recipe-delete delete-btn">' +
    '<span class="button-label">Delete</span>' +
    '</button>' +
    '</div>' +
    '</div>';

let serverBase = '//localhost:8080/';
let RECIPES_URL = serverBase + 'Recipes';
let SHOPPING_LIST_URL = serverBase + 'Shopping-List';

/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
function myFunction() {
    let x = document.getElementById('myLinks');
    if (x.style.display === 'block') {
        x.style.display = 'none';
    } else {
        x.style.display = 'block';
    }
}

function password() {
    let x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
    ) {
        document.getElementById('topBtn').style.display = 'block';
    } else {
        document.getElementById('topBtn').style.display = 'none';
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function recipePopulateDropDown() {
    $.getJSON(RECIPES_URL, function (data) {
        let dropDown = $('.dropDownRecipes');
        let recipeData = data.recipes;
        dropDown.append('<option selected="true">Select Recipe</option>');
        for (let i = 0; i < recipeData.length; i++) {
            let optionsList = recipeData[i];
            dropDown.append(
                "<option value='optionList.recipeName'>" +
                optionsList.recipeName +
                '</option>'
            );
        }
    });
}

function addMeal(id) {
    let meal = $('#' +
        `${id} :selected`).text();
    let recipe = $('#js-' +
        `${id} :selected`).text();
    let mealAdd = $('#js-recipe-add-' + `${id}`);
    localStorage.setItem(meal, recipe);
    mealAdd.append(
        "<li><strong>" +
        meal +
        ": " +
        "</strong>" +
        recipe +
        '<button class="js-meal-delete meal-btn"> Delete' +
        "</button>" +
        "</li>"
    );
}

function handleMealDelete() {
    $(".js-meals").on("click", ".js-meal-delete", function (e) {
        e.preventDefault();
        $(this).closest('li').remove();
    });
}

function handleMeal() {

}

function splitIngredient() {

};

function addIngredients(recipe) {
    console.log('Adding Recipe Ingredient');
    $.ajax({
        method: 'GET',
        url: RECIPES_URL + '/' + recipe,
        data: JSON.stringify(item),
        success: function (data) {
            // splitIngredient();
        },
        dataType: 'json',
        contentType: 'application/json'
    });


    // function addShoppingItem(item) {
    //     console.log('Adding shopping item');
    //     $.ajax({
    //         method: 'POST',
    //         url: SHOPPING_LIST_URL,
    //         data: JSON.stringify(item),
    //         success: function (data) {
    //             getAndDisplayShoppingList();
    //         },
    //         dataType: 'json',
    //         contentType: 'application/json'
    //     });
    // }



}

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
    console.log('Adding shopping item');
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
    console.log('DELETING ITEM');
    $.ajax({
        method: 'DELETE',
        url: SHOPPING_LIST_URL + '/' + item,
        success: getAndDisplayShoppingList
    });
}

function updateShoppingListitem(item) {
    console.log('Updating shopping list item');
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

function addRecipe(recipe) {
    console.log('Adding recipe');
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
    console.log('Deleting recipe');
    $.ajax({
        url: RECIPES_URL + '/' + recipeId,
        method: 'DELETE',
        success: getAndDisplayRecipes
    });
}

function getAndDisplayRecipes() {
    console.log('Retrieving recipes');
    $.getJSON(RECIPES_URL, function (recipes) {
        let newRecipes = recipes.recipes;
        let recipesElement = newRecipes.map(function (recipe) {
            let element = $(recipeTemplate);
            element.attr('id', recipe.id);
            element.find('.js-recipe-name').text(recipe.recipeName);
            let newIngredient = recipe.ingredients;
            let splitIngredient = newIngredient.split(',').map(function (ingredient) {
                return ingredient.trim();
            });
            element
                .find('.js-recipe-ingredients')
                .append('<li>' + splitIngredient + '</li>');
            element.find('.js-recipe-instructions').text(recipe.instructions);
            return element;
        });
        $('.js-recipes').html(recipesElement);
    });
}

function handleRecipeDelete() {
    $('.js-recipes').on('click', '.js-recipe-delete', function (e) {
        e.preventDefault();
        deleteRecipe(
            $(e.currentTarget)
            .closest('.js-recipe')
            .attr('id')
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
    recipePopulateDropDown();

    handleShoppingListAdd();
    handleShoppingListDelete();

    handleRecipeAdd();
    handleRecipeDelete();
});