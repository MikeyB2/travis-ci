let userServerBase = '//localhost:8080/api/';
let authServerBase = '//localhost:8080/api/auth/';
let USERS_URL = userServerBase + 'users';
let USERSAUTH_URL = authServerBase + 'login';

function addLogin(item) {
    console.log('Requesting Access');
    $.ajax({
        method: 'POST',
        url: USERSAUTH_URL,
        data: JSON.stringify(item),
        success: function (data) {
            console.log("Access Granted");
            // res.send('./welcome.html');

        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function addNewUserLogin(item) {
    console.log('creating user');
    $.ajax({
        method: 'POST',
        url: USERS_URL,
        data: JSON.stringify(item),
        success: function (data) {
            console.log("New User Created");
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}


function handleLogin() {
    $('#js-login-form').submit(function (e) {
        e.preventDefault();
        addLogin({
            username: $(e.currentTarget)
                .find('#username')
                .val(),
            password: $(e.currentTarget)
                .find('#password')
                .val(),
        });
    });
}

function handleNewUser() {
    $('#js-new-user').submit(function (e) {
        e.preventDefault();
        addNewUserLogin({
            username: $(e.currentTarget)
                .find('#js-username')
                .val(),
            password: $(e.currentTarget)
                .find('#js-password')
                .val(),
            email: $(e.currentTarget)
                .find('#js-email')
                .val(),
            firstName: $(e.currentTarget)
                .find('#js-firstName')
                .val(),
            lastName: $(e.currentTarget)
                .find('#js-lastName')
                .val(),
        });
    });
}



$(function () {
    handleLogin(),
        handleNewUser()
});