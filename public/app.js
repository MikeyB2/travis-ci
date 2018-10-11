let shoppingItemTemplate =
    '<li class="js-shopping-item">' +
    '<p><span class="shopping-item js-shopping-item-name"></span><span class="shopping-item js-shopping-item-amount"></span></p>' +
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

let serverBase = "//localhost:8080/";
let RECIPES_URL = serverBase + "Recipes/";
let SHOPPING_LIST_URL = serverBase + "Shopping-List/";

function getAndDisplayShoppingList() {
    console.log("Retrieving shopping list");
    $.getJSON(SHOPPING_LIST_URL, function (items) {
        let newItems = items.listItems;
        let itemElements = newItems.map(function (item) {
            let element = $(shoppingItemTemplate);
            element.attr("id", item.id);
            let itemName = element.find(".js-shopping-item-name");
            let itemAmount = element.find(".js-shopping-item-amount");
            itemName.text(item.ingredient);
            itemAmount.text(item.amount);
            element.attr("data-checked", item.checked);
            if (item.checked) {
                itemName.addClass("shopping-item__checked");
                itemAmount.addClass("shopping-item__checked");
            }
            return element;
        });
        $(".js-shopping-list").html(itemElements);
    });
}

function addShoppingItem(item) {
    console.log("Adding shopping item: " + item);
    $.ajax({
        method: "POST",
        url: SHOPPING_LIST_URL,
        data: JSON.stringify(item),
        success: function (data) {
            getAndDisplayShoppingList();
        },
        dataType: "json",
        contentType: "application/json"
    });
}
function deleteShoppingItem(item) {
    console.log('DELETING ITEM ' + item);
    console.log(SHOPPING_LIST_URL + item);
    $.ajax({
        method: "DELETE",
        url: SHOPPING_LIST_URL,
        data: JSON.stringify(item),
        success: function (data) {
            getAndDisplayShoppingList();
        },
        dataType: "json",
        contentType: "application/json"
    });
}

function handleShoppingListAdd() {
    $("#js-shopping-list-form").submit(function (e) {
        e.preventDefault();
        addShoppingItem({

            ingredient: $(e.currentTarget)
                .find("#js-new-item")
                .val(),
            amount: $(e.currentTarget)
                .find("#js-new-amount")
                .val(),
            checked: false
        });
    });
}

function handleShoppingListDelete() {
    $(".js-shopping-list").on("click", ".js-shopping-item-delete", function (e) {
        e.preventDefault();
        deleteShoppingItem(
            $(e.currentTarget)
                .closest(".js-shopping-item")
                .attr("id")
        );
    });
}


function handleShoppingCheckedToggle() {
    $(".js-shopping-list").on("click", ".js-shopping-item-toggle", function (e) {
        console.log('CHECKED');
        e.preventDefault();
        // let element = $(e.currentTarget).closest(".js-shopping-item");
        // let item = {
        //     id: element.attr("id"),
        //     checked: !JSON.parse(element.attr("data-checked")),
        //     ingredient: element.find(".js-shopping-item-name").text()
        // };
        // updateShoppingListitem(item);
    });
}


function addRecipe(recipe) {
    console.log("Adding recipe: " + recipe);
    $.ajax({
        method: "POST",
        url: RECIPES_URL,
        data: JSON.stringify(recipe),
        success: function (data) {
            getAndDisplayRecipes();
        },
        dataType: "json",
        contentType: "application/json"
    });
}

function getAndDisplayRecipes() {
    console.log("Retrieving recipes");
    $.getJSON(RECIPES_URL, function (recipes) {
        console.log("Rendering recipes" + recipes);
        // var recipesElement = recipes.map(function (recipe) {
        //     var element = $(recipeTemplate);
        //     element.attr("id", recipe.id);
        //     element.find(".js-recipe-name").text(recipe.name);
        //     recipe.ingredients.forEach(function (ingredient) {
        //         element
        //             .find(".js-recipe-ingredients")
        //             .append("<li>" + ingredient + "</li>");
        //     });
        //     return element;
        // });
        // $(".js-recipes").html(recipesElement);
    });
}



// function handleRecipeDelete() {
//     $(".js-recipes").on("click", ".js-recipe-delete", function (e) {
//         e.preventDefault();
//         deleteRecipe(
//             $(e.currentTarget)
//             .closest(".js-recipe")
//             .attr("id")
//         );
//     });
// }

function handleRecipeAdd() {
    $("#js-recipe-form").submit(function (e) {
        e.preventDefault();
        let ingredients = $(e.currentTarget)
            .find("#ingredients-list")
            .val()
            .split(",")
            .map(function (ingredient) {
                return ingredient.trim();
            });
        addRecipe({
            recipeName: $(e.currentTarget)
                .find("#recipe-name")
                .val(),
            ingredients: ingredients,
            instructions: $(e.currentTarget)
                .find("#instructions")
                .val(),
        });
    });
}




// //  on page load do this
$(function () {
    getAndDisplayShoppingList();
    // getAndDisplayRecipes();

    handleShoppingListAdd();
    handleShoppingListDelete();
    handleShoppingCheckedToggle();

    handleRecipeAdd();
    // handleRecipeDelete();
})