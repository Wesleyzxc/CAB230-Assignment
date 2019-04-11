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
    .then(function (response) {
      return response.offences;
    })
    .catch(function (error) {
      console.log("There has been a problem with your fetch operation: ", error.message);
    });
}

function UseOffences() {
  const [offences, setOffences] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    GetOffences()
      .then(offence => {
        console.log(offence);
        setOffences(offence);
      })
      .catch(e => {
        setError(e);

      })
  }, []);

  return {
    offences, error: null
  }
}

function testButton() {
  const { offences, error } = UseOffences();
  return (
    <ul>
      {offences.map(offence =>
        (
          <li>{offence}</li>
        ))}
    </ul>
  );

}

function OffenceButton() {
  testButton();


}

function App() {


  return (
    // how to get padding
    <div className="Credentials">
      <RegisterButton />
      <LoginButton />
      <br></br>
      <button onClick={OffenceButton()}>List offences</button>

    </div >


  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
