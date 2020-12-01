import React, { useState } from "react";
import { UseRequest } from "./api.js";
import { Chart } from "./chart.js";
import { Maps } from "./heatmap.js";
import "./mainstyle.css";


/**
 * Fetch request for search 
 * @param {string} token token for authentication
 * @param {boolean} setsearchLoad whether search is completed
 * @param {setState} setResults set returned result to state
 * @param {setState} setFilterResults set filtered result to state
 * @param {string} searchParam offence parameter (required)
 * @param {string} areaParam area parameter
 * @param {string} ageParam age parameter
 * @param {string} genderParam gender parameter
 * @param {string} yearParam year parameter
 * @param {string} monthParam month parameter
 * 
 */
function searchRequest(token, setsearchLoad, setResults, setFilterResults, setFailedSearch, searchParam, areaParam, ageParam, genderParam, yearParam, monthParam) {
    // Generating url for get request
    // depending on each filter

    let url = "https://172.22.29.230/search?offence=" + encodeURIComponent(searchParam);
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
            "Authorization": 'Bearer ' + token,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`Server sent ${response.status}`);
        })
        .then(result => {
            // Save results to state
            setsearchLoad(false);
            setResults(result.result);
            setFilterResults(result.result);
            return result;
        })
        .catch(function (error) {
            // Clears state
            setsearchLoad(false);
            setResults([]);
            // Error catching different error codes
            if (error.toString() === "Error: Server sent 400") {
                setFailedSearch("You can't search for an empty offence!")
            }
            if (error.toString() === "Error: Server sent 401") {
                setFailedSearch("You're not logged in! How'd you get here?");
            }
            if (error.toString() === "Error: Server sent 500") {
                setFailedSearch("Please enter a valid offence!");
            }
        });
}


/**
 *  Generates drop down menu for search filters
 * @param {*} props set parameter state, name of filter, array of items that can be filtered and id
 */
function SearchFilter(props) {
    // selector given props to set ID and name of the filter, filled up by values in props.filter
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

/**
 * Search component that allows filtering of search and display search 
 * @param {string} token for authentication
 * @param {setState} toggleOffence for toggling offence list
 */
export function Search(props) {
    const [searchResult, setResults] = useState([]);
    const [searchFiltered, setFilterResults] = useState([]);
    const [searchParam, setSearchParam] = useState("");
    const [areaParam, setAreaParam] = useState("");
    const [ageParam, setAgeParam] = useState("");
    const [genderParam, setGenderParam] = useState("");
    const [yearParam, setYearParam] = useState("");
    const [monthParam, setMonthParam] = useState("");

    const [failedSearch, setFailedSearch] = useState(null);
    const [searchLoad, setsearchLoad] = useState(false);

    // Fetch request for search filters
    const { areas } = UseRequest(
        "https://172.22.29.230/areas"
    );
    const { ages } = UseRequest(
        "https://172.22.29.230/ages"
    );
    const { years } = UseRequest(
        "https://172.22.29.230/years"
    );
    const { genders } = UseRequest(
        "https://172.22.29.230/genders"
    );


    return (
        <div className="Search">
            <form
                onSubmit={event => {
                    // shows offence table if empty search
                    if (searchParam === "") {
                        props.toggleOffence();
                    }
                    event.preventDefault();
                    setsearchLoad(true);
                    // function for fetch request
                    searchRequest(props.token, setsearchLoad, setResults, setFilterResults, setFailedSearch, searchParam, areaParam, ageParam, genderParam, yearParam, monthParam);
                }}
            >
                <label>Search Crime:</label>
                <input
                    aria-labelledby="search-button"
                    id="search"
                    name="search"
                    type="search"
                    value={searchParam}
                    autoFocus
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
                        // Clear button that clears every filter selector on click
                        // and resets state
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
                // Area filter
                setParam={setAreaParam}
                filterBy="Filter by Area"
                filter={areas}
                id="filterLGA"
            />
            <SearchFilter
                // Age filter
                setParam={setAgeParam}
                filterBy="Filter by Age"
                filter={ages}
                id="filterAge"
            />
            <SearchFilter
                // Year filter
                setParam={setYearParam}
                filterBy="Filter by Year"
                filter={years}
                id="filterYear"
            />
            <SearchFilter
                // Month filter
                setParam={setMonthParam}
                filterBy="Filter by Month"
                filter={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                id="filterMonth"
            />
            <SearchFilter
                // Gender filter
                setParam={setGenderParam}
                filterBy="Filter by Gender"
                filter={genders}
                id="filterGender"
            />

            <br />
            <br />
            <br />

            {failedSearch !== null ? (
                <p className="errorMessage">{failedSearch}</p>
            ) : null}

            {searchLoad ? <div className="loader" /> : null}

            <DisplaySearch
                // Display search in a table
                setResults={setResults}
                searchResult={searchResult}
                areas={areas}
                searchFiltered={searchFiltered}
            />





        </div>
    );
}

/**
 * Function to clear each filter based on ID
 * @param {id} filterID id of filter that needs to be cleared
 */
function clearSearch(filterID) {
    let element = document.getElementById(filterID);
    element.value = "";
}


/**
 * Display search component with charts, maps and sortable tables
 * @param {*} props array of searchResults and filtered search, setState to set results after sorting, areas for chart labels
 * and boolean for tracking first search results which is empty
 */
function DisplaySearch(props) {
    const [showChart, setShowChart] = useState(false);
    const [sorted, setSorted] = useState(false);
    const [sort, setSort] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const toggleChart = () => {
        showChart === false ? setShowChart(true) : setShowChart(false);
    };

    // Creating an array of lat + long for mapping
    let latLong = [];
    props.searchResult.map(search =>
        latLong.push([search.lat, search.lng, search.total])
    );
    const toggleMap = () => {
        showMap === false ? setShowMap(true) : setShowMap(false);

    };


    // Two sort functions that alternates between ascending/ descending 
    function sortHeader(e) {
        // sort by total count
        if (sorted) {
            props.searchResult.sort(function (a, b) {
                return a.total - b.total;
            });
        } else {
            props.searchResult.sort(function (a, b) {
                return b.total - a.total;
            });
        }
        // sets the new results to sorted results
        setSorted(oldSorted => !oldSorted);
        props.setResults(props.searchResult);
    }

    function sortLGA(e) {
        if (sort) {
            // sort by alphabetical order
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
        // sets new results to sorted results
        setSort(oldSorted => !oldSorted);
        props.setResults(props.searchResult);
    }

    // Updates results simultaneously when filtering by LGA
    const filterList = event => {
        let updatedList = props.searchFiltered;
        updatedList = updatedList.filter(function (item) {
            return (
                item.LGA.toLowerCase().search(event.target.value.toLowerCase()) !== -1
            );
        });

        props.setResults(updatedList);
    };

    return (
        <div className="displaySearch">
            <div>
                <button onClick={toggleChart}> Toggle chart</button>
                <button onClick={toggleMap}> Toggle map</button>
            </div>

            <Chart
                searchResult={props.searchResult}
                areas={props.areas}
                showChart={showChart}
            />

            <Maps addressPoints={latLong} showMap={showMap} />

            <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Filter by LGA"
                onChange={filterList}
            />
            <div id="resultTable">
                <table >
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
        </div>
    );
}
