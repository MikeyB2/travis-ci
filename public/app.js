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
    console.log('Click!!');
    let x = document.getElementById("myLinks");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        document.getElementById("topBtn").style.display = "block";
    } else {
        document.getElementById("topBtn").style.display = "none";
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
            dropDown.append("<option value='optionList.recipeName'>" + optionsList.recipeName + "</option>");
        }
    });
};

function addMeal() {

    // document.getElementsByClassName("mealPlan").value = document.getElementById("js-recipe-add").value;
    // let value = document.getElementsByClassName("mealPlan");
    // console.log('value: ' + value);
    document.getElementById("js-recipe-add").innerHTML = "<li><strong>Meal:</strong></li>"
    // need to add a delete button when it is added


    // $(".select-btn").on('click', function (e) {
    //     let value =
    //         $(e.currentTarget)
    //         .find('.mealPlan')
    //         .val();
    //     console.log('click' + value);
    // });

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



function getAndDisplayRecipes() {
    console.log('Retrieving recipes');
    $.getJSON(RECIPES_URL, function (recipes) {
        let newRecipes = recipes.recipes;
        console.log('All Recipes: ' + `${newRecipes}`);
        let recipesElement = newRecipes.map(function (recipe) {
            let element = $(recipeTemplate);
            element.attr("id", recipe.id);
            element.find(".js-recipe-name").text(recipe.recipeName);
            console.log('Recipe Name: ' + recipe.recipeName);
            console.log('Recipe ingredients: ' + recipe.ingredients);
            // Object.keys(newRecipes).forEach(function (ingredient) {
            //     console.log("ingredient test1: " + recipe.ingredients);
            //     console.log("ingredient test2: " + element);
            // console.log("ingredient test3: " + ingredient);
            let newIngredient = recipe.ingredients;
            console.log('Ingredients: ' + newIngredient);
            let splitIngredient = newIngredient
                .split(',')
                .map(function (ingredient) {
                    console.log('Ingredient5: ' + ingredient);

                    return ingredient.trim();
                });
            element
                .find(".js-recipe-ingredients")
                .append("<li>" + splitIngredient + "</li>");
            element.find(".js-recipe-instructions").text(recipe.instructions);
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


// new user submit form

function addUser(user) {
    console.log('Adding user: ' + user);
    $.ajax({
        method: 'POST',
        url: USERS_URL,
        data: JSON.stringify(user),
        success: function (data) {
            // getAndDisplayRecipes();
        },
        dataType: 'json',
        contentType: 'application/json'
    });
    console.log('New User: ' + user);
}

function handleNewUserAdd() {
    $('#js-new-user').submit(function (e) {
        e.preventDefault();
        addNewUser({
            firstName: $(e.currentTarget)
                .find('#js-firstName')
                .val(),
            lastName: $(e.currentTarget)
                .find('#js-lastName')
                .val(),
            username: $(e.currentTarget)
                .find('#js-username')
                .val(),
            password: $(e.currentTarget)
                .find('#js-password')
                .val(),
            email: $(e.currentTarget)
                .find('#js-email')
                .val(),
            checked: false
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
    handleShoppingCheckedToggle();

    handleRecipeAdd();
    handleRecipeDelete();
});