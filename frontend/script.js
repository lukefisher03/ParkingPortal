"use strict";
// Get form data
Object.defineProperty(exports, "__esModule", { value: true });
var form = document.getElementById("form");
var submitButton = document.getElementById("submit-button");
var parseInput = function (formData) {
    var errorMessage = "";
    var formOutput = {};
    var signupInfo = {};
    for (var _i = 0, _a = formData.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        value = value.toString();
        switch (key) {
            case "name":
                if (value == "") {
                    errorMessage += "Name cannot be blank\n";
                }
                else {
                    console.log("Name ".concat(value));
                    signupInfo["name"] = value;
                }
                break;
            case "email":
                if (!validateEmail(value)) {
                    errorMessage += "Email is invalid\n";
                }
                else {
                    console.log("Email ".concat(value));
                    signupInfo["email"] = value;
                }
                break;
            case "password":
                if (value.length < 8) {
                    errorMessage += "Password must be longer than 8 characters\n";
                }
                else {
                    //TODO: Hash the password
                    console.log("Password ".concat(value));
                    signupInfo["password_hash"] = value;
                }
                break;
            case "phone-number":
                var strippedString = value.replace(/\D/g, "");
                if (strippedString.length < 10) {
                    errorMessage += "Phone number is not long enough\n";
                }
                else {
                    console.log("phone-number ".concat(strippedString));
                    signupInfo["phone_number"] = strippedString;
                }
                console.log("Phone Number ".concat(value));
                break;
        }
    }
    formOutput["body"] = signupInfo;
    if (errorMessage.length >= 0) {
        console.error(errorMessage);
        formOutput["errors"] = errorMessage;
        return formOutput;
    }
    else {
        console.log("All form input data looks good");
        return formOutput;
    }
};
var validateEmail = function (email) {
    return String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
submitButton.addEventListener("click", function () {
    var formData = new FormData(form);
    var formOutput = parseInput(formData);
    if (formOutput.errors) {
        console.error("Errors were found!\n\n".concat(formOutput.errors));
    }
    else {
        postSignupInfo(formOutput.body);
    }
});
var postSignupInfo = function (body) {
    var apiUrl = "http://127.0.0.1:8000/accounts/signup";
    var requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    };
    fetch(apiUrl, requestOptions)
        .then(function (response) {
        console.log("Got here!");
        return response.json();
    })
        .then(function (data) {
        console.log(JSON.stringify(data, null, 2));
    });
};
