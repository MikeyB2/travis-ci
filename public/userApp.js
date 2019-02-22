let userServerBase = '/api/';
let authServerBase = '/api/auth/';
let USERS_URL = userServerBase + 'users';
let USERSAUTH_URL = authServerBase + 'login';

function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav" || x.className === "nav-active") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
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

function demo() {
    console.log("DEMO");
    addLogin({
        username: "Testuser",
        password: "Testuser12"
    });
}


function registerForm() {
    console.log("timeout");
    location.href = './login.html';
    console.log("click");
    $("#myBtn").click();
}

function register() {
    console.log("Register");
    setTimeout(registerForm, 500)


}

function addLogin(item) {
    console.log('Requesting Access');
    console.log('Return User Info', item);
    $.ajax({
        method: 'POST',
        url: USERSAUTH_URL,
        data: JSON.stringify(item),
        success: function (data) {
            console.log("Access Granted");
            location.href = "/welcome.html";
            localStorage.setItem('user', item.username);
            localStorage.setItem('token', data.authToken);
            alert('Welcome To CSTM Made!!');

        },
        error: function (request, status, error) {
            let message = "There was a problem with your form: " + request.responseText;
            window.alert(message);
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}

function addNewUserLogin(item) {
    console.log('creating user');
    console.log('New User info', item);
    $.ajax({
        method: 'POST',
        url: USERS_URL,
        data: JSON.stringify(item),
        success: function (data) {
            console.log("New User Created");
            console.log("Access Granted");
            addLogin(item)
        },
        error: function (request, status, error) {
            let message = "There was a problem with your form: " + request.responseText;
            window.alert(message);
        },
        dataType: 'json',
        contentType: 'application/json'
    });
}


function handleLogin() {
    $('#js-login-form').submit(function (e) {
        e.preventDefault();
        localStorage.setItem('user', $('#username').val());
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
        localStorage.setItem('user', $('#js-username').val());
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