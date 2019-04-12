import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { RegisterButton, LoginForm } from "./api";
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



function App() {
  const [offenceList, setOffences] = useState([]);

  const { offences, error, loading } = UseOffences();

  if (loading) {
    return <h1>Loading...</h1>
  }

  return (
    <div className="App">
      <RegisterButton />
      <LoginForm />
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
