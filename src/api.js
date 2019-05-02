import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./api.css";

function GetRequest(url) {
    return fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Network response was not ok");

        })
        .catch(function (error) {
            console.log("There has been a problem with your fetch operation: ", error.message);
        });
}

export function UseRequest(url) {
    const [offences, setOffences] = useState([]);
    const [areas, setAreas] = useState([]);
    const [ages, setAges] = useState([]);
    const [years, setYears] = useState([]);
    const [genders, setGenders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetRequest(url)
            .then(data => {
                setOffences(data.offences);
                setAreas(data.areas);
                setYears(data.years);
                setGenders(data.genders);
                setAges(data.ages);
                setLoading(false);
            })
            .catch(e => {
                setError(e);

            })
    }, []);

    return {
        offences, areas, years, genders, ages, error: null, loading
    }
}

function fetchRegister(name, password, setRegister) {

    fetch("https://cab230.hackhouse.sh/register", {
        method: "POST",
        body: 'email=' + name + '&password=' + password,
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
            setRegister("You've successfully register! Login to search what you need");

        })
        .catch(function (error) {
            console.log("There has been a problem with registering. Are you already registered? ", error.message);
            setRegister("There has been a problem with registering. Are you already registered?");
        });
}

export function RegisterForm(props) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [registerState, setRegisterState] = useState(null);
    const setRegister = (event) => {
        setRegisterState(event)
    }
    if (props.token !== "") {
        return null
    }
    return (
        <div className="RegisterForm">
            <h3>Register <button onClick={() => { props.setLogin(true) }}>Registered? Click to log in</button></h3>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (name !== "" && password !== "") {

                        console.log(name, password);
                        fetchRegister(name, password, setRegister);
                    }
                    else {
                        setRegisterState("Your email and password field can't be empty!")
                    }
                }}
            >
                <label htmlFor="regName">Your email:  </label>

                <input placeholder="Enter your email"
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
                <input placeholder="Enter your password" id=" regPassword" password="regPassword" type="password" value={password}
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
            handleLoginState("Your email and password does not match.")
        });
}

export function LoginForm(props) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loginState, setLoginState] = useState(null);

    const handleLoginState = (event) => {
        setLoginState(event);
    }
    if (props.token !== "") {
        return (
            <div className="loggedIn" >
                Welcome, {name}!
                {props.token === "" ? <p></p> : <button onClick={() => {
                    props.clearToken();
                    setName("");
                    setPassword("");
                    setLoginState(null);
                }}>Log out</button>}
                <br />
            </div >

        )
    }
    return (

        <div className="LoginForm">
            <h3>Login <button align="right" onClick={() => { props.setLogin(false) }}>No account? Click to register</button></h3>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    //console.log(name, password); // form inputs
                    if (name !== "" && password !== "")
                        getToken(name, password, props, handleLoginState);
                    else {
                        setLoginState("Your email and password fields can't be empty!")
                    }
                }}>
                <label htmlFor="name">Your email:  </label>

                <input placeholder="Enter your email"
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
                <input placeholder="Enter your password" id="password" password="password" type="password" value={password}
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

export function GridOffence(props) {
    if (props.offenceList.length <= 0) {
        return null
    }
    return (
        <div className="grid-container">
            {props.offenceList.map(offence => (
                <div className="grid-item" key={props.offenceList.indexOf(offence)}>{offence}</div>
            ))}
        </div>
    );

}