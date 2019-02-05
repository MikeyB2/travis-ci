let shoppingItemTemplate =

    '<li class="js-shopping-item">' +
    '<input type="checkbox" name="check" class="strikethrough" value="1">' +
    '<div class="shopping-item shopping-name js-shopping-item-name"></div></div>' +
    '<button class="js-shopping-item-delete shopping-btn">' +
    '<span><i class="fas fa-minus"></i></span>' +
    '</button>' +
    '</li>' +
    '<hr />';

let recipeTemplate =
    '<div class="recipe js-recipe">' +
    '<h3 class="js-recipe-name recipe-name"><h3>' +
    '<hr>' +
    '<h4 class="ingredients">Ingredients</h4>' +
    '<hr>' +
    '<ul class="js-recipe-ingredients recipe-ingredients">' +
    '</ul>' +
    '<hr>' +
    '<h4 class="instructions">Instructions</h4>' +
    '<hr>' +
    '<p class="js-recipe-instructions recipe-instructions"></p>' +
    '<hr>' +
    '<div class="recipe-controls">' +
    '<button class="js-recipe-delete delete-btn">' +
    '<span class="button-label">Delete</span>' +
    '</button>' +
    '</div>' +
    '</div>';

let RECIPES_URL = '/Recipes';
let SHOPPING_LIST_URL = '/Shopping-List';
let MEALS_URL = '/Meals';

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
    let x = document.getElementById('password');
    if (x.type === 'password') {
        x.type = 'text';
    } else {
        x.type = 'password';
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

function logout() {
    // localStorage.removeItem('user', 'token');
    localStorage.clear();
}

// ACCORDION FUNCTION

let acc = document.getElementsByClassName("accordion");
let i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

function recipePopulateDropDown() {
    let username = localStorage.getItem('user');
    $.ajax({
        url: RECIPES_URL,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Authorization": 'Bearer ' + localStorage.getItem('token')
        },
        data: {
            username: username
        },
        success: function (data) {
            let dropDown = $('.dropDownRecipes');
            let recipeData = data.recipes;
            dropDown.append('<option selected="true">Select Recipe</option>');
            for (let i = 0; i < recipeData.length; i++) {
                let optionsList = recipeData[i];
                let recipeDropDown = optionsList.recipeName;
                dropDown.append(
                    $(`<option value='${recipeDropDown}'>${recipeDropDown}</option>`)
                );
            }
        }
    });
}

let dayArray = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
];

function displayMeals() {
    console.log('Retrieving Meals');
    let username = localStorage.getItem('user');
    $.ajax({
        url: MEALS_URL,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Authorization": 'Bearer ' + localStorage.getItem('token')
        },
        data: {
            username: username
        },
        success: function (meals) {
            for (let i = 0; i < dayArray.length; i++) {
                let dayOfWeek = meals.meals.filter(item => item.day == dayArray[i]);
                let mealDay = dayArray[i];
                let mealElements = dayOfWeek.map(function (meal) {
                    let element = $(`<li class="js-mealItem" id=${meal.id}>
                    <p><strong><span class="js-meal-name">${
                        meal.meal
                        }</span></strong>:   <span class="js-recipe-name">${
                        meal.recipe
                        }</span>
                    <button type="button" class="js-meal-delete meal-btn "> Delete
                    </button>
                    </p>
                    </li>`);
                    return element;
                });
                $('#js-recipe-add-' + `${mealDay}`).html(mealElements);
            }
        }
    });
}

function handleMealAdd(e, id) {
    e.preventDefault();
    let username = localStorage.getItem('user');
    addMeal({
        meal: $(e.currentTarget)
            .find('#' + `${id} :selected`)
            .val(),
        recipe: $(e.currentTarget)
            .find('#js-' + `${id} :selected`)
            .val(),
        day: id,
        username: username
    });
}

function addMeal(item) {
    console.log('Adding Meal');
    let recipeIngredients = item.recipe;
    $.ajax({
        method: 'POST',
        url: MEALS_URL,
        headers: {
            "Authorization": 'Bearer ' + localStorage.getItem('token')
        },
        data: JSON.stringify(item),
        success: function (data) {
            displayMeals();
            addIngredients(recipeIngredients);
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function deleteMeal(meal) {
    $.ajax({
        method: 'DELETE',
        url: MEALS_URL + '/' + meal,
        headers: {
            "Authorization": 'Bearer ' + localStorage.getItem('token')
        },
        success: displayMeals
    });
}

function handleMealDelete() {
    $('.js-meals').on('click', '.js-meal-delete', function (e) {
        e.preventDefault();
        deleteMeal(
            $(e.currentTarget)
                .closest('.js-mealItem')
                .attr('id')
        );
    });
}

function splitIngredient(ingredients) {
    let username = localStorage.getItem('user');
    let newIngredients = ingredients.split(',');
    for (let i = 0; i < newIngredients.length; i++) {
        let currentIngredient = newIngredients[i];
        let postIngredient = {};
        postIngredient['ingredient'] = `${currentIngredient}`;
        postIngredient['username'] = `${username}`;
        addShoppingItem(postIngredient);
    }
}

function addIngredients(recipe) {
    console.log('Adding Recipe Ingredient(s) to Shopping-List');
    let username = localStorage.getItem('user');
    const settings = {
        url: RECIPES_URL,
        contentType: 'application/json',
        headers: {
            "Authorization": 'Bearer ' + localStorage.getItem('token')
        },
        data: {
            username: username
        },
        type: 'GET',
        dataType: 'json',
        cache: false,
        success: function (recipes) {
            let allRecipesAvailable = recipes.recipes;
            for (let i = 0; i < allRecipesAvailable.length; i++) {
                let currentRecipe = allRecipesAvailable[i];
                if (recipe === currentRecipe.recipeName) {
                    let ingredientsToSplit = currentRecipe.ingredients;
                    splitIngredient(ingredientsToSplit);
                }
            }
        }

    };
    $.ajax(settings);
}

function getAndDisplayShoppingList() {
    console.log('Retrieving shopping list');
    let username = localStorage.getItem('user');
    $.ajax({
        url: SHOPPING_LIST_URL,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Authorization": 'Bearer ' + localStorage.getItem('token')
        },
        data: {
            username: username
        },
        success: function (items) {
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
        }
    });
}

function addShoppingItem(item) {
    console.log('Adding shopping item');
    $.ajax({
        method: 'POST',
        url: SHOPPING_LIST_URL,
        data: JSON.stringify(item),
        headers: {
            "Authorization": 'Bearer ' + localStorage.getItem('token')
        },
        success: function (data) {
            getAndDisplayShoppingList();
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function deleteShoppingItem(item) {
    $.ajax({
        method: 'DELETE',
        url: SHOPPING_LIST_URL + '/' + item,
        headers: {
            "Authorization": 'Bearer ' + localStorage.getItem('token')
        },
        success: getAndDisplayShoppingList
    });
}

function updateShoppingListitem(item) {
    console.log('Updating shopping list item');
    $.ajax({
        url: SHOPPING_LIST_URL + '/' + item.id,
        method: 'PUT',
        data: JSON.stringify(item),
        headers: {
            "Authorization": 'Bearer ' + localStorage.getItem('token')
        },
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
        let username = localStorage.getItem('user');
        addShoppingItem({
            ingredient: $(e.currentTarget)
                .find('#js-new-item')
                .val(),
            amount: $(e.currentTarget)
                .find('#js-new-amount')
                .val(),
            username: username
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
        headers: {
            "Authorization": 'Bearer ' + localStorage.getItem('token')
        },
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
        headers: {
            "Authorization": 'Bearer ' + localStorage.getItem('token')
        },
        method: 'DELETE',
        success: getAndDisplayRecipes
    });
}

function getAndDisplayRecipes() {
    console.log('Retrieving recipes');
    let username = localStorage.getItem('user');
    const settings = {
        url: RECIPES_URL,
        contentType: 'application/json',
        headers: {
            "Authorization": 'Bearer ' + localStorage.getItem('token')
        },
        data: {
            username: username
        },
        type: 'GET',
        dataType: 'json',
        cache: false,
        success: function (recipes) {
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
        }

    };
    $.ajax(settings);
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
        let username = localStorage.getItem('user');
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
            instructions: instructions,
            username: username
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

    displayMeals();
    handleMealDelete();
});