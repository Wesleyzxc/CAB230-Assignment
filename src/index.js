import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { RegisterButton, LoginButton } from "./api";
import "./index.css";

function GetOffences() {
  return fetch("https://cab230.hackhouse.sh/offences")
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

function UseOffences() {
  const [offences, setOffences] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetOffences()
      .then(offences => {
        setOffences(offences.offences);
        setLoading(false);
      })
      .catch(e => {
        setError(e);

      })
  }, []);

  return {
    offences, error: null, loading
  }
}

function GridOffence(props) {
  return (
    <div className="grid-item">{props.eachOffence}</div>
  );

}

function Form(props) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);
  console.log(props);
  return (
    <div className="App">
      <form
        onSubmit={event => {
          event.preventDefault();
          console.log(event.target.name.value);
        }}
      >
        <label htmlFor="name">Your email:  </label>

        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={event => {
            const { value } = event.target;
            if (!/[0-9]/.test(value)) {
              setNameError(null);
            } else {
              setNameError("You can't input numbers");
            }
            setName(value);
          }}
        />
        <br></br>

        <label htmlFor="password"> Your password:  </label>
        <input id="password" password="password" type="password" />

        {nameError != null ? <p>Error: {nameError}</p> : null}
        <br></br>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function App() {
  const [offenceList, setOffences] = useState([]);

  const { offences, error, loading } = UseOffences();

  if (loading) {
    return <h1>Loading...</h1>
  }

  return (
    <div className="App">
      <RegisterButton />

      <Form />
      <LoginButton />
      <br></br>

      <button onClick={() =>
        setOffences(offences)
      }>List offences</button>

      <div className="grid-container">
        {offenceList.map(offence => (
          <GridOffence key={offenceList.indexOf(offence)} eachOffence={offence} />
        ))}
      </div>

    </div >


  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
