import React, { useState } from "react";
import ReactDOM from "react-dom";



export function RegisterForm() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [registerState, setRegisterState] = useState(null);
    return (
        <div className="RegisterForm">
            <h3>Register</h3>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    console.log(name, password);
                    let nameStr = name;
                    let passStr = password;


                    fetch("https://cab230.hackhouse.sh/register", {
                        method: "POST",
                        body: 'email=' + nameStr + '&password=' + passStr,
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
                            //console.log(result); // register message 
                            setRegisterState(result.message);

                        })
                        .catch(function (error) {
                            console.log("There has been a problem with registering. Are you already registered? ", error.message);
                            setRegisterState("There has been a problem with registering. Are you already registered?");
                        });
                }}
            >
                <label htmlFor="regName">Your username:  </label>

                <input
                    id="regName"
                    name="regName"
                    type="text"
                    value={name}
                    onChange={nameEvent => {
                        const { value } = nameEvent.target;
                        setName(value);
                    }}
                />
                <br></br>

                <label htmlFor="regPassword"> Your password:  </label>
                <input id="regPassword" password="regPassword" type="password" value={password}
                    onChange={passwordEvent => {
                        const { value } = passwordEvent.target;
                        setPassword(value);
                    }} />

                {registerState != null ? <p>{registerState}</p> : null}

                <br></br>
                <button type="submit">Register</button>
            </form>
        </div >
    );


}

function getToken(nameStr, passStr, props, handleLoginState) {

    return fetch("https://cab230.hackhouse.sh/login", {
        method: "POST",
        body: 'email=' + nameStr + '&password=' + passStr,
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
            props.handleToken(result.token)
            handleLoginState("You have logged in successfully!")
            // return console.log(result.token); // token
        })
        .catch(function (error) {
            console.log("There has been a problem with your fetch operation: ", error.message);
            props.handleToken("")
            handleLoginState("Your account and password does not match.")
        });
}

export function LoginForm(props) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loginState, setLoginState] = useState(null);

    const handleLoginState = (event) => {
        setLoginState(event);
    }
    return (

        <div className="LoginForm">
            <h3>Login</h3>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    //console.log(name, password); // form inputs
                    getToken(name, password, props, handleLoginState);
                }}
            >
                <label htmlFor="name">Your email:  </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={nameEvent => {
                        const { value } = nameEvent.target;
                        setName(value);
                    }}
                />
                <br></br>

                <label htmlFor="password"> Your password:  </label>
                <input id="password" password="password" type="password" value={password}
                    onChange={passwordEvent => {
                        const { value } = passwordEvent.target;
                        setPassword(value);
                    }} />

                {loginState != null ? <p>{loginState}</p> : null}

                <br></br>
                <button type="submit">Login</button>
            </form>
        </div >
    );
}