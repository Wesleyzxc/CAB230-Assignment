import React from "react";
import ReactDOM from "react-dom";

export function RegisterButton() {
    const fetchToken = () => {
        fetch("https://cab230.hackhouse.sh/register", {
            method: "POST",
            body: 'email=n9972676%40qut.edu.au&password=testaccount',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok");
            })
            .then(function (result) {
                console.log(result);

            })
            .catch(function (error) {
                console.log("There has been a problem with registering. Are you already registered? ", error.message);
            });
    }
    return (
        <div>
            <p>Register your account</p>
            <button onClick={fetchToken}>Register!</button>

        </div >
    )
}

export function LoginButton() {
    const fetchToken = () => {
        fetch("https://cab230.hackhouse.sh/login", {
            method: "POST",
            body: 'email=n9972676%40qut.edu.au&password=testaccount',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response was not ok");
            })
            .then(function (result) {
                console.log(result);
            })
            .catch(function (error) {
                console.log("There has been a problem with your fetch operation: ", error.message);
            });
    }
    return (
        <div>
            <p>Login details</p>
            <button onClick={fetchToken}>Login</button>
        </div >
    )
}