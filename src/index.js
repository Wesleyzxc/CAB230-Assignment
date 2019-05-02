import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { RegisterForm, LoginForm, UseRequest, GridOffence } from "./api";
import "./index.css";
import { Bar } from "react-chartjs-2";
import { Map, TileLayer } from "react-leaflet";
import HeatmapLayer from "../src/HeatmapLayer";

function Chart(props) {
  const [monthlyData, setMonthlyData] = useState([]);
  let crimeCount = [];
  let areaCount = [];
  props.searchResult.map(each => {
    crimeCount.push(each.total);
    areaCount.push(each.LGA); // So that graph doesn't assign to first LGA if areaParam is specified
  });

  const data = {
    labels: areaCount,
    datasets: [
      {
        label: "Offence count",
        data: crimeCount,
        backgroundColor: "rgba(255,99,132,1)",
        borderColor: "red",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)"
      }
    ]
  };

  if (props.showChart === false) {
    return null;
  }
  return (
    <div className="chart">
      <Bar data={data} />
    </div>
  );
}

function searchRequest(
  token,
  setsearchLoad,
  setResults,
  setFilterResults,
  setFailedSearch,
  searchParam,
  areaParam,
  ageParam,
  genderParam,
  yearParam,
  monthParam
) {
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
      Authorization: "Bearer " + token,
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
      setsearchLoad(false);
      setResults(result.result);
      setFilterResults(result.result);
      return result;
    })
    .catch(function (error) {
      setsearchLoad(false);
      setResults([]);
      setFailedSearch("Your search parameters are invalid");
      console.log("There has been a problem with your fetch operation: ");
    });
}

function SearchFilter(props) {
  return (
    <div className="searchFilters">
      <select
        id={props.id}
        onChange={area => {
          const { value } = area.target;
          props.setParam(value);
        }}
      >
        <option value="" defaultValue>
          {props.filterBy}
        </option>
        {props.filter.map(search => (
          <option value={search} key={search}>
            {search}
          </option>
        ))}
      </select>
    </div>
  );
}

function Search(props) {
  const [searchResult, setResults] = useState([]);
  const [searchFiltered, setFilterResults] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [areaParam, setAreaParam] = useState("");
  const [ageParam, setAgeParam] = useState("");
  const [genderParam, setGenderParam] = useState("");
  const [yearParam, setYearParam] = useState("");
  const [monthParam, setMonthParam] = useState("");


  const [firstSearch, setFirstSearch] = useState(true);
  const [failedSearch, setFailedSearch] = useState(null);

  const [searchLoad, setsearchLoad] = useState(false);

  const { areas, areaError, areaLoading } = UseRequest(
    "https://cab230.hackhouse.sh/areas"
  );
  const { ages, ageError, ageLoading } = UseRequest(
    "https://cab230.hackhouse.sh/ages"
  );
  const { years, yearError, yearLoading } = UseRequest(
    "https://cab230.hackhouse.sh/years"
  );
  const { genders, genderError, genderLoading } = UseRequest(
    "https://cab230.hackhouse.sh/genders"
  );


  return (
    <div className="Search">
      <form
        onSubmit={event => {
          event.preventDefault();
          setsearchLoad(true);
          searchRequest(
            props.token,
            setsearchLoad,
            setResults,
            setFilterResults,
            setFailedSearch,
            searchParam,
            areaParam,
            ageParam,
            genderParam,
            yearParam,
            monthParam
          );
          // setResults(search);
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
        <button
          type="submit"
          onClick={() => {
            setFailedSearch(null);
          }}
        >
          Search
        </button>

        <button
          type="button"
          onClick={() => {
            setResults([]);
            setFailedSearch(null);
            setsearchLoad(false);
            setSearchParam("");
            setAreaParam("");
            clearSearch("filterLGA");
            clearSearch("filterYear");
            clearSearch("filterAge");
            clearSearch("filterMonth");
            clearSearch("filterGender");
          }}
        >
          Clear search
        </button>
      </form>

      <SearchFilter
        setParam={setAreaParam}
        filterBy="Filter by Area"
        filter={areas}
        id="filterLGA"
      />
      <SearchFilter
        setParam={setAgeParam}
        filterBy="Filter by Age"
        filter={ages}
        id="filterAge"
      />
      <SearchFilter
        setParam={setYearParam}
        filterBy="Filter by Year"
        filter={years}
        id="filterYear"
      />
      <SearchFilter
        setParam={setMonthParam}
        filterBy="Filter by Month"
        filter={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
        id="filterMonth"
      />
      <SearchFilter
        setParam={setGenderParam}
        filterBy="Filter by Gender"
        filter={genders}
        id="filterGender"
      />
      <br />
      <br />
      <br />

      {searchLoad ? <div className="loader" /> : null}

      <DisplaySearch
        setResults={setResults}
        searchResult={searchResult}
        areas={areas}
        firstSearch={firstSearch}
        searchFiltered={searchFiltered}
      />

      {failedSearch !== null ? (
        <p className="emptySearch">{failedSearch}</p>
      ) : null}
    </div>
  );
}

function clearSearch(filterID) {
  let element = document.getElementById(filterID);
  element.value = "";
}

function DisplaySearch(props) {
  const [LGA, setLGA] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [sorted, setSorted] = useState(false);
  const [sort, setSort] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const toggleChart = () => {
    showChart === false ? setShowChart(true) : setShowChart(false);
  };

  let latLong = [];
  props.searchResult.map(search =>
    latLong.push([search.lat, search.lng, search.total])
  );
  const toggleMap = () => {
    showMap === false ? setShowMap(true) : setShowMap(false);

  };


  if (props.searchResult.length === 0 && props.firstSearch === false) {
    return <p className="emptySearch">Current search is empty</p>;
  }


  function sortHeader(e) {
    if (sorted) {
      props.searchResult.sort(function (a, b) {
        return a.total - b.total;
      });
    } else {
      props.searchResult.sort(function (a, b) {
        return b.total - a.total;
      });
    }
    setSorted(oldSorted => !oldSorted);
    props.setResults(props.searchResult);
  }

  function sortLGA(e) {
    if (sort) {

      props.searchResult.sort(function (a, b) {
        var textA = a.LGA.toUpperCase();
        var textB = b.LGA.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
    } else if (sort === false) {
      props.searchResult.sort(function (a, b) {
        var textA = a.LGA.toUpperCase();
        var textB = b.LGA.toUpperCase();
        return textA > textB ? -1 : textA < textB ? 1 : 0;
      });
    }
    setSort(oldSorted => !oldSorted);
    props.setResults(props.searchResult);
  }

  const filterList = event => {
    let updatedList = props.searchFiltered;
    updatedList = updatedList.filter(function (item) {
      return (
        item.LGA.toLowerCase().search(event.target.value.toLowerCase()) !== -1
      );
    });

    props.setResults(updatedList);
  };

  // if (props.searchResult.length === 0 && props.firstSearch === true) {
  //   return <p className="emptySearch" />;
  // }

  return (
    <div className="displaySearch">
      <div>
        <button onClick={toggleChart}> Toggle chart</button>
        <button onClick={toggleMap}> Toggle map</button>
      </div>
      <input
        type="text"
        className="form-control form-control-lg"
        placeholder="Search"
        onChange={filterList}
      />
      <Chart
        searchResult={props.searchResult}
        areas={props.areas}
        showChart={showChart}
      />

      {props.searchResult.length < 1 ? null : <Maps addressPoints={latLong} showMap={showMap} />}

      <table id="resultTable">
        <thead>
          <tr>
            <th onClick={sortLGA}>LGA</th>
            <th onClick={sortHeader}>Total</th>
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
    </div>
  );
}

function Maps(props) {
  let layerHidden = false;
  let radius = 8;
  let blur = 8;
  let max = 1;
  let minOpacity = 0.05;
  if (props.addressPoints.length === 1) { minOpacity = 2; max = 3; radius = 30 };
  const gradient = {
    0.1: "#89BDE0",
    0.2: "#96E3E6",
    0.4: "#82CEB6",
    0.6: "#FAF3A5",
    0.8: "#F5D98B",
    "1.0": "#DE9A96"
  };

  if (props.showMap === false) {
    return null;
  }

  let dataPoints = [];
  // creates 2D array if searched by LGA so that function can get lat, long, intensity
  if (props.addressPoints.length === 1) { dataPoints.push(props.addressPoints); console.log(dataPoints) }
  else { dataPoints = props.addressPoints }
  return (
    <div align="center">
      <Map center={[-10, 0]} zoom={3}>
        {!layerHidden && (
          <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            points={dataPoints}

            longitudeExtractor={m => m[1]}
            latitudeExtractor={m => m[0]}
            gradient={gradient}
            intensityExtractor={m => parseFloat(m[2])}
            radius={Number(radius)}
            blur={Number(blur)}
            max={Number.parseFloat(max)}
            minOpacity={minOpacity}
          />
        )}
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </Map>
    </div>
  );
}

function AfterLoginPage(props) {
  if (props.token !== "") {
    return (
      <div className="lockLogin">
        <button id="offenceButton" onClick={props.toggleOffence}>
          Toggle offences
        </button>
        <GridOffence offenceList={props.offenceList} />
        <div className="lockLogin">
          <Search token={props.token} />
        </div>
      </div>
    );
  }

  return <div className="lockLogin" />;
}

function App() {
  document.title = "Search crime";
  const [login, setLogin] = useState(true);
  const [offenceList, setOffences] = useState([]);
  const [token, setToken] = useState("");
  const { offences, error, loading } = UseRequest(
    "https://cab230.hackhouse.sh/offences"
  );

  if (loading) {
    return (
      <div className="loader" />
    );
  }
  const handleToken = event => {
    setToken(event);
  };
  const clearToken = () => {
    setToken("");
  };
  const toggleOffence = () => {
    offenceList.length > 0 ? setOffences([]) : setOffences(offences);
  };

  return (
    <div className="App">
      {login ? <LoginForm
        setLogin={setLogin}
        handleToken={handleToken}
        token={token}
        clearToken={clearToken}
      /> : <RegisterForm setLogin={setLogin} token={token} />}



      <AfterLoginPage
        token={token}
        offenceList={offenceList}
        toggleOffence={toggleOffence}
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
