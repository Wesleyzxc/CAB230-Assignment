import React, { useState, useEffect } from "react";
import "./api.css";

/**
 * Get request that returns json of response
 * @param {string} url url to fetch from
 */
function GetRequest(url) {
    return fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }

        })
        .catch(function (error) {
            console.log("There has been a problem with your fetch operation: ", error.message);
        });
}


/**
 * Component that sets returned json from GetRequest
 * @param {string} url that is passed to GetRequest
 * @returns array of items that is used for filtering, and error/ loading for handling
 */
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
        offences, areas, years, genders, ages, error, loading
    }
}

/**
 * Component that handles registration
 * @param {string} email email of registration
 * @param {string} password password of email
 * @param {setState} setRegister sets staate returned message
 * @param {setState} setEmail sets state to email
 * @param {setState} setPassword sets state to password
 * @param {setState} setLogin sets boolean state if successful
 */
function fetchRegister(email, password, setRegister, setSuccess) {

    fetch("https://localhost/register", {
        method: "POST",
        body: 'email=' + email + '&password=' + password,
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.status);
        })
        .then(function (result) {
            if (result) {
                setSuccess(true);
                setRegister("You've successfully registered! Log in to search what you need");
            }
            else { setRegister("This email has been registered before, try logging in!") }

        })
        .catch(function (error) {
            console.log("There has been a problem with registering. Are you already registered? ", error);
            setRegister("There has been a problem with registering. Are you already registered?");
        });
}

/**
 * 
 * @param {*} props set login state to true if successful operation, token to check if user has logged in,
 * and setEmail and setPassword to save email and password on  successful registration
 */
export function RegisterForm(props) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [registerState, setRegisterState] = useState(null);
    const [registerSuccess, setSuccess] = useState(false);

    useEffect(() => {
        props.setLogin(registerSuccess);
    })

    if (props.token !== "") {
        return null
    }
    return (
        <div className="RegisterForm">
            <h3>Register <button onClick={() => {
                props.setLogin(true)
            }
            }>Registered? Click to log in</button></h3>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (name !== "" && password !== "") {
                        // console.log(name, password);
                        fetchRegister(name, password, setRegisterState, setSuccess);
                        props.setEmail(name);
                        props.setPassword(password);
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

                {registerState != null ? <p className="errorMessage">{registerState}</p> : null}

                <br></br>
                <button type="submit">Register</button>
            </form>
        </div >
    );

}

/**
 * Fetch request for logging in
 * @param {string} emailStr email address
 * @param {string} passStr password
 * @param {props} stores token
 * @param {setState} sets message based on login status
 */
function getToken(emailStr, passStr, props, handleLoginState) {

    return fetch("https://localhost/login", {
        method: "POST",
        body: 'email=' + emailStr + '&password=' + passStr,
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.status);
        })
        .then(function (result) {
            props.handleToken(result.access_token);
            handleLoginState("You have logged in successfully!")
        })
        .catch(function (error) {
            props.clearToken();
            handleLoginState("Your email and password does not match.")
        });
}

/**
 * 
 * @param {*} props setLogin, handleToken, if successful, and token to store token. clearToken and clearRepopulate upon logging out
 * and repopulateEmail/password to save credentials upon successful registration.
 */
export function LoginForm(props) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loginState, setLoginState] = useState(null);
    const handleLoginState = (event) => {
        setLoginState(event);
    }
    useEffect(() => {
        setName(props.repopulateEmail);
        setPassword(props.repopulatePassword);
    }, []);

    if (props.token !== "") {
        return (
            <div className="loggedIn" >
                Welcome, {name}!
                {props.token === "" ? null : <button onClick={() => {
                    props.clearToken();
                    setName("");
                    setPassword("");
                    setLoginState(null);
                    // props.clearRepopulate();
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
                <input placeholder="Enter your password"
                    id="password"
                    password="password"
                    type="password"
                    value={password}
                    onChange={passwordEvent => {
                        const { value } = passwordEvent.target;
                        setPassword(value);
                    }} />

                {loginState != null ? <p className="errorMessage">{loginState}</p> : null}

                <br></br>
                <button type="submit">Login</button>

            </form>
        </div >
    );
}

/**
 * Grids offences that users can choose to query from
 * @param {*} props 
 */
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