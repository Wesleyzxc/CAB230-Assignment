import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { RegisterForm, LoginForm, UseRequest, UseAreas } from "./api";
import "./index.css";

function GridOffence(props) {
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

function Search(props) {
  const [searchResult, setResults] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [areaParam, setAreaParam] = useState("");
  const [failedSearch, setFailedSearch] = useState(null);
  const [loading, setLoading] = useState(true);

  if (props.token === "") {
    return (<p>Login to search</p>)
  }
  return (
    <div>
      <form
        onSubmit={event => {
          event.preventDefault();
          let url = "https://cab230.hackhouse.sh/search?offence=" + searchParam;
          if (areaParam !== "") {
            url += "&area=" + areaParam;
          }
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
        <label>Search Crime:</label>
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
        <label>By Area:</label>
        <select type="submit" id="filterLGA"
          onChange={area => {
            const { value } = area.target;
            setAreaParam(value);
          }}>
          <option value="" defaultValue>Filter by LGA</option>
          {props.areas.map(search => (
            <option value={search} key={(search)}>{search}</option>
          ))}
        </select>
        <br />
        <button onClick={() => setFailedSearch(null)}>Search</button>

      </form>
      <button onClick={() => {
        setResults([]);
        setFailedSearch(null);
        setSearchParam("");
        setAreaParam("");
        let element = document.getElementById("filterLGA");
        element.value = "default";
      }
      }>Clear search</button>

      {failedSearch !== null ? <p>{failedSearch}</p> : null}
      <DisplaySearch searchResult={searchResult} />
    </div >
  );
}

function DisplaySearch(props) {
  const [LGA, setLGA] = useState("");

  if (props.searchResult.length === 0) {
    return <p>Current search is empty</p>
  }
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>LGA</th>
            <th>Total</th>
          </tr>
        </thead>
        {props.searchResult.map(search => (
          <tbody key={props.searchResult.indexOf(search)}>
            <tr>
              <td>{search.LGA}</td>
              <td>{search.total}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div >
  )
}

function AfterLoginPage(props) {
  if (props.token !== "") {
    return (
      <div>
        <button id="offenceButton" onClick={props.toggleOffence}>Toggle offences</button>
        <GridOffence offenceList={props.offenceList} />
        <div className="lockLogin">
          <Search token={props.token} areas={props.areas} />
        </div>
      </div>

    )
  }

  return (
    <div className="lockLogin">Login or register first</div>
  )
}

function App() {
  const [offenceList, setOffences] = useState([]);
  const [token, setToken] = useState("");
  const { offences, error, loading } = UseRequest("https://cab230.hackhouse.sh/offences");
  const { areas, areaError, areaLoading } = UseRequest("https://cab230.hackhouse.sh/areas");

  if (loading) {
    return <h1>Loading...</h1>
  }

  const handleToken = (event) => {
    setToken(event);
  }

  const clearToken = () => {
    setToken("")
  }

  const toggleOffence = () => { offenceList.length > 0 ? setOffences([]) : setOffences(offences) }

  return (
    <div className="App">
      <RegisterForm token={token} />
      <LoginForm handleToken={handleToken} token={token} clearToken={clearToken} />
      <br></br>

      <AfterLoginPage token={token} offenceList={offenceList} toggleOffence={toggleOffence} areas={areas} />
    </div >


  );
}



const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
