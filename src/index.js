import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { RegisterForm, LoginForm, UseRequest, UseAreas } from "./api";
import "./index.css";
import { Bar } from 'react-chartjs-2';



function Chart(props) {
  let crimeCount = []
  props.searchResult.map(each => {
    crimeCount.push(each.total)
  })

  const data = {
    labels: props.areas,
    datasets: [
      {
        label: 'Offence count',
        borderWidth: 1,
        data: crimeCount,
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
      }
    ]
  };

  if (props.showChart === false) {
    return null
  }

  return (
    < div className="chart" >
      <Bar
        data={data}
      />
    </div >
  )
}

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

function SearchFilter(props) {
  return (
    <select id={props.id}
      onChange={area => {
        const { value } = area.target;
        props.setParam(value);
      }}>
      <option value="" defaultValue>{props.filterBy}</option>
      {props.filter.map(search => (
        <option value={search} key={(search)}>{search}</option>
      ))}
    </select>
  )
}

function searchRequest(token, setResults, setFailedSearch, searchParam, areaParam, ageParam, genderParam, yearParam, monthParam) {
  let url = "https://cab230.hackhouse.sh/search?offence=" + searchParam;
  if (areaParam !== "") {
    url += "&area=" + areaParam;
  }
  if (ageParam !== "") {
    url += "&age=" + ageParam;
  }
  if (genderParam !== "") {
    url += "&gender=" + genderParam;
  }
  if (yearParam !== "") {
    url += "&year=" + yearParam;
  }
  if (monthParam !== "") {
    url += "&month=" + monthParam;
  }
  fetch(url, {
    method: "GET",
    headers: {
      Authorization:
        "Bearer " +
        token,
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

}

function Search(props) {
  const [searchResult, setResults] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [areaParam, setAreaParam] = useState("");
  const [ageParam, setAgeParam] = useState("");
  const [genderParam, setGenderParam] = useState("");
  const [yearParam, setYearParam] = useState("");
  const [monthParam, setMonthParam] = useState("");

  const { areas, areaError, areaLoading } = UseRequest("https://cab230.hackhouse.sh/areas");
  const { ages, ageError, ageLoading } = UseRequest("https://cab230.hackhouse.sh/ages");
  const { years, yearError, yearLoading } = UseRequest("https://cab230.hackhouse.sh/years");
  const { genders, genderError, genderLoading } = UseRequest("https://cab230.hackhouse.sh/genders");

  const [failedSearch, setFailedSearch] = useState(null);

  if (props.token === "") {
    return (<p>Login to search</p>)
  }
  return (
    <div>
      <form
        onSubmit={event => {
          event.preventDefault();
          searchRequest(props.token, setResults, setFailedSearch, searchParam, areaParam, ageParam, genderParam, yearParam, monthParam);
        }}
      >
        <label >Search Crime:</label>
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
        <SearchFilter setParam={setAreaParam} filterBy="Filter by Area" filter={areas} id="filterLGA" />
        <br />
        <label>By Age:</label>
        <SearchFilter setParam={setAgeParam} filterBy="Filter by Age" filter={ages} id="filterAge" />
        <br />
        <label>By Year:</label>
        <SearchFilter setParam={setYearParam} filterBy="Filter by Year" filter={years} id="filterYear" />
        <br />
        <label>By Month:</label>
        <SearchFilter setParam={setMonthParam} filterBy="Filter by Month" filter={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} id="filterMonth" />
        <br />
        <label>By Gender:</label>
        <SearchFilter setParam={setGenderParam} filterBy="Filter by Gender" filter={genders} id="filterGender" />
        <br />
        <button onClick={() => setFailedSearch(null)}>Search</button>

      </form>
      <button onClick={() => {
        setResults([]);
        setFailedSearch(null);
        setSearchParam("");
        setAreaParam("");
        clearSearch("filterLGA");
        clearSearch("filterYear");
        clearSearch("filterAge");
        clearSearch("filterMonth");
        clearSearch("filterGender");
      }
      }>Clear search</button>

      {failedSearch !== null ? <p>{failedSearch}</p> : null}
      <DisplaySearch searchResult={searchResult} areas={areas} />
    </div >
  );
}

function clearSearch(filterID) {
  let element = document.getElementById(filterID);
  element.value = "";
}

function DisplaySearch(props) {
  const [LGA, setLGA] = useState("");
  const [showChart, setShowChart] = useState(false);

  const toggleChart = () => {
    showChart === false ? setShowChart(true) : setShowChart(false)
  }

  if (props.searchResult.length === 0) {
    return <p>Current search is empty</p>
  }
  return (
    <div>
      <button onClick={toggleChart}> Toggle chart</button>
      <Chart searchResult={props.searchResult} areas={props.areas} showChart={showChart} />
      <table align="center">
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
      <div className="lockLogin">
        <button id="offenceButton" onClick={props.toggleOffence}>Toggle offences</button>
        <GridOffence offenceList={props.offenceList} />
        <div className="lockLogin">
          <Search token={props.token} />
        </div>
      </div>

    )
  }

  return (
    <div className="lockLogin"></div>
  )
}

function App() {
  const [offenceList, setOffences] = useState([]);
  const [token, setToken] = useState("");
  const { offences, error, loading } = UseRequest("https://cab230.hackhouse.sh/offences");


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
    < div className="App" >

      <RegisterForm token={token} />
      <LoginForm handleToken={handleToken} token={token} clearToken={clearToken} />

      <AfterLoginPage token={token} offenceList={offenceList} toggleOffence={toggleOffence} />
    </div >


  );
}



const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
