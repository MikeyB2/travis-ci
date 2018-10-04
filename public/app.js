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
        $('body').append(
            '<li>' + data.shoppingList[index].ingrediant + '</li>');
    }
    $('body').append('<hr>');
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayShoppingList() {
    getShoppingList(displayShoppingList);
}

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
        $('body').append(
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