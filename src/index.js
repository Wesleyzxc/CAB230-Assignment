import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { RegisterForm, LoginForm } from "./api";
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

function Search() {
  //setResult(result);
  //console.log(result);
  const [searchResult, setResults] = useState([]);
  const [searchParam, setSearchParam] = useState("");

  return (
    <div>
      <form
        onSubmit={event => {
          event.preventDefault();
          let offenceStr = searchParam;
          let url = "https://cab230.hackhouse.sh/search?offence=" + offenceStr;
          fetch(url, {
            method: "GET",
            headers: {
              Authorization:
                "Bearer " +
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0NjU3LCJlbWFpbCI6Indlc2xleTEifSwiaWF0IjoxNTU1MjA1ODkzLCJleHAiOjE1NTUyOTIyOTN9.8rBaEj7l6K1HLndeHowt7ktwMTfw4ZJ_AcyPZaXrVpM",
              "Content-Type": "application/x-www-form-urlencoded"
            }
          })
            .then(function (response) {
              if (response.ok) {
                return response.json();
              }
              throw new Error("Network response was not ok");
            })
            .then(result => {
              setResults(result.result);
              return result;
            })
            .catch(function (error) {
              setResults([]);
              console.log(
                "There has been a problem with your fetch operation: "
              );
            });
        }}
      >
        <label htmlFor="searchCrime">Search Crime</label>
        <input
          id="searchCrime"
          name="searchCrime"
          type="text"
          value={searchParam}
          onChange={searchEvent => {
            const { value } = searchEvent.target;
            setSearchParam(value);
          }}
        />
        <br />
        <button type="submit">Search</button>
      </form>

      {searchResult.map(offence => (
        <p key={offence.LGA}>
          {offence.LGA}: {offence.total}
        </p>
      ))}
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
      <RegisterForm />
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

      <Search />

    </div >


  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
