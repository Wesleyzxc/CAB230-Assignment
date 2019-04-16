import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { RegisterForm, LoginForm } from "./api";
import "./index.css";
import { fail } from "assert";

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

function Search(props) {
  const [searchResult, setResults] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [failedSearch, setFailedSearch] = useState(null);
  const [loading, setLoading] = useState(true);
  return (
    <div>
      <form
        onSubmit={event => {
          event.preventDefault();
          let url = "https://cab230.hackhouse.sh/search?offence=" + searchParam;
          fetch(url, {
            method: "GET",
            headers: {
              Authorization:
                "Bearer " +
                props.token,
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
              setFailedSearch("Your search parameters are invalid");
              console.log(
                "There has been a problem with your fetch operation: "
              );
            });
        }}
      >
        <label>Search Crime</label>
        <input
          aria-labelledby="search-button"
          id="search"
          name="search"
          type="search"
          value={searchParam}
          onChange={searchEvent => {
            const { value } = searchEvent.target;
            setSearchParam(value);

          }}
        />
        <br />
        <button type="submit" onClick={() => setFailedSearch(null)}>Search</button>

      </form>
      <button onClick={() => {
        setResults([]);
        setFailedSearch(null);
      }
      }>Clear search</button>

      {failedSearch != null ? <p>{failedSearch}</p> : null}

      {
        searchResult.map(offence => (
          <p key={offence.LGA}>
            {offence.LGA}: {offence.total}
          </p>
        ))
      }
    </div >
  );
}



function App() {
  const [offenceList, setOffences] = useState([]);
  const [token, setToken] = useState("");
  const { offences, error, loading } = UseOffences();

  if (loading) {
    return <h1>Loading...</h1>
  }

  const handleToken = (event) => {
    setToken(event);
    console.log(token);
  }

  return (
    <div className="App">
      <RegisterForm />

      <LoginForm handleToken={handleToken} token={token} />
      <br></br>
      <button onClick={() =>
        setOffences(offences)
      }>List offences</button>

      <button onClick={() => setOffences([])}>Clear offences</button>

      <div className="grid-container">
        {offenceList.map(offence => (
          <GridOffence key={offenceList.indexOf(offence)} eachOffence={offence} />
        ))}
      </div>

      <Search token={token} />

    </div >


  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
