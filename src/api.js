import React, { useState, useEffect } from "react";
import LinkButton from "./linkrouter.js"

import "./mainstyle.css";

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

    // handles returned data here
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
function fetchRegister(email, password, setRegister, setLogin) {

    fetch("https://172.22.29.230/register", {
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
                setLogin(true);
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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registerState, setRegisterState] = useState(null);


    if (props.token !== "") {
        return null
    }
    return (
        <div className="RegisterForm">
            <h3>Register
                <LinkButton to="/login"
                    onClick={() => {
                        props.setLogin(true)
                    }
                    }>Registered? Click to log in</LinkButton>

            </h3>


            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (email !== "" && password !== "") {
                        // console.log(name, password);
                        fetchRegister(email, password, setRegisterState, props.setLogin);
                        props.setEmail(email);
                        props.setPassword(password);
                    }

                }}
            >
                <label htmlFor="regName">Your email:  </label>

                <input placeholder="Enter your email"
                    id="regName"
                    name="regName"
                    type="text"
                    value={email}
                    required
                    autoFocus
                    onChange={nameEvent => {
                        const { value } = nameEvent.target;
                        setEmail(value);
                    }}
                />
                <br></br>

                <label htmlFor="regPassword"> Your password:  </label>
                <input placeholder="Enter your password"
                    id=" regPassword"
                    password="regPassword"
                    type="password"
                    value={password}
                    required
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
function getToken(emailStr, passStr, props, setLoginState) {

    return fetch("https://172.22.29.230/login", {
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
        })
        .catch(function (error) {
            props.clearToken();
            setLoginState("Your email and password does not match.")
        });
}

/**
 * 
 * @param {*} props setLogin, handleToken, if successful, and token to store token. clearToken and clearRepopulate upon logging out
 * and repopulateEmail/password to save credentials upon successful registration.
 */
export function LoginForm(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginState, setLoginState] = useState(null);

    // sets the state to the registered email and password for quick login
    useEffect(() => {
        setEmail(props.repopulateEmail);
        setPassword(props.repopulatePassword);
    }, []);

    if (props.token !== "") {
        return (
            <div className="loggedIn" >
                Welcome, {email}!
                {props.token === "" ? null : <button onClick={() => {
                    props.clearToken();
                    setEmail("");
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
            <h3>Login
                    <LinkButton to="/register" onClick={() => { props.setLogin(false) }}>
                    No account? Click to register
                    </LinkButton>
            </h3>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (email !== "" && password !== "")
                        getToken(email, password, props, setLoginState);
                }}>
                <label htmlFor="name">Your email:  </label>

                <input placeholder="Enter your email"
                    id="name"
                    name="name"
                    type="text"
                    value={email}
                    required
                    autoFocus
                    onChange={nameEvent => {
                        const { value } = nameEvent.target;
                        setEmail(value);
                    }}
                />
                <br></br>

                <label htmlFor="password"> Your password:  </label>
                <input placeholder="Enter your password"
                    id="password"
                    password="password"
                    type="password"
                    value={password}
                    required
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
            <table>
                <tbody>
                    <tr>{props.offenceList.map(offence => (
                        <td className="grid-item" key={props.offenceList.indexOf(offence)}>{offence}</td>
                    ))}</tr>
                </tbody>
            </table>
        </div>
    );

}
