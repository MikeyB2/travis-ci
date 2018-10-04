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
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayShoppingList() {
    console.log("is this working");
    getShoppingList(displayShoppingList);
}

// //  on page load do this
$(function () {
    getAndDisplayShoppingList();
})