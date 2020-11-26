import React, { useState } from "react";
import ReactDOM from "react-dom";
import { RegisterForm, LoginForm, UseRequest, GridOffence } from "./api";
import { Search } from "./search.js";

import "./mainstyle.css";

import { BrowserRouter as Router } from "react-router-dom"


/**
 * Component that renders after logging in to allow search and display results
 * @param {*} props token for authentication, array of offences and toggle offence for display
 */
function AfterLoginPage(props) {
  if (props.token !== "") {
    return (
      <div className="lockLogin">
        <button id="offenceButton" onClick={props.toggleOffence}>
          Toggle offences
        </button>
        <GridOffence offenceList={props.offenceList} />
        <div className="lockLogin">
          <Search token={props.token} toggleOffence={props.toggleOffence} />
        </div>
      </div>
    );
  }

  return <div className="lockLogin" />;
}

function App() {
  document.title = "CAB203 Assignment";
  const [login, setLogin] = useState(true);
  const [offenceList, setOffences] = useState([]);
  const [token, setToken] = useState("");
  const [repopulateEmail, setEmail] = useState("");
  const [repopulatePassword, setPassword] = useState("");
  const { offences, error, loading } = UseRequest(
    "https://172.22.29.230/offences"
  );

  // Shows loading while setting up page
  if (loading) {
    return (
      <div className="loader" />
    );
  }

  // Error loading offences
  if (error) {
    console.log(error);
  }

  // functions to handle token
  const handleToken = event => {
    setToken(event);
  };
  const clearToken = () => {
    setToken("");
  };
  // Toggle to show offence or not
  const toggleOffence = () => {
    offenceList.length > 0 ? setOffences([]) : setOffences(offences);
  };

  // Clear repopulated field that is filled by registering
  const clearRepopulate = () => {
    setEmail("");
    setPassword("");
  }

  return (
    <div className="App">
      {login ? <LoginForm
        setLogin={setLogin}
        handleToken={handleToken}
        token={token}
        clearToken={clearToken}
        repopulateEmail={repopulateEmail}
        repopulatePassword={repopulatePassword}
        clearRepopulate={clearRepopulate}
      /> : <RegisterForm setLogin={setLogin} token={token} setEmail={setEmail} setPassword={setPassword} />}

      <AfterLoginPage
        token={token}
        offenceList={offenceList}
        toggleOffence={toggleOffence}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Router><App /></Router>, rootElement);
