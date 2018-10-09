let shoppingItemTemplate =
    '<li class="js-shopping-item">' +
    '<p><span class="shopping-item js-shopping-item-name"></span></p>' +
    '<div class="shopping-item-controls">' +
    '<button class="js-shopping-item-toggle">' +
    '<span class="button-label">check</span>' +
    "</button>" +
    '<button class="js-shopping-item-delete">' +
    '<span class="button-label">delete</span>' +
    "</button>" +
    "</div>" +
    "</li>";

let recipeTemplate =
    '<div class="recipe js-recipe">' +
    '<h3 class="js-recipe-name"><h3>' +
    "<hr>" +
    '<ul class="js-recipe-ingredients">' +
    "</ul>" +
    '<div class="recipe-controls">' +
    '<button class="js-recipe-delete">' +
    '<span class="button-label">delete</span>' +
    "</button>" +
    "</div>" +
    "</div>";



// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getShoppingList(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
    setTimeout(function () {
        callbackFn(MOCK_SHOPPING_LIST)
    }, 1);
}


// this function stays the same when we connect
// to real API later
function displayShoppingList(data) {
    console.log(data);
    for (index in data.shoppingList) {
        $('.shopping-list').append(
            '<li>' + data.shoppingList[index].ingrediant + '</li>');
    }
    $('body').append('<hr>');
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayShoppingList() {
    getShoppingList(displayShoppingList);
}


function getRecipes(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
    setTimeout(function () {
        callbackFn(MOCK_RECIPES)
    }, 1);
}


// this function stays the same when we connect
// to real API later
function displayRecipes(data) {
    console.log(data);
    for (index in data.recipes) {
        $('.recipes').append(
            '<ul>' + data.recipes[index].name + '</ul>');
    }
    $('body').append('<hr>');
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayRecipes() {
    getRecipes(displayRecipes);
}







// //  on page load do this
$(function () {
    getAndDisplayShoppingList();
    getAndDisplayRecipes();
})