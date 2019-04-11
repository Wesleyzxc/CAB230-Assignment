import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./index.css";

function RegisterButton(){
  var returnedMessage
   const fetchToken = () => {
    fetch("https://cab230.hackhouse.sh/register", {
      method: "POST",
      body: 'email=n9972676%40qut.edu.au&password=testaccount',
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok");
      })
      .then(function (result) {
        console.log(result);
        ;
      })
      .catch(function (error) {
        returnedMessage = error.message;
        console.log(returnedMessage);
        console.log("There has been a problem with registering. Are you already registered? ", error.message);
      });
  }
  return (
    <div>
      <p>Register your account {returnedMessage}</p>
      <button onClick={fetchToken}>Register!</button>
      
    </div >
  )
}


function LoginButton() {
  const fetchToken = () => {
    fetch("https://cab230.hackhouse.sh/login", {
      method: "POST",
      body: 'email=n9972676%40qut.edu.au&password=testaccount',
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok");
      })
      .then(function (result) {
        console.log(result);
      })
      .catch(function (error) {
        console.log("There has been a problem with your fetch operation: ", error.message);
      });
  }
  return (
    <div>
      <p>Login details</p>
      <button onClick={fetchToken}>Login</button>
    </div >
  )
}

function getOffences() {
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

  function useOffences(){
    const [loading, setLoading] = useState(true);
    const [offences, setOffences] = useState();
    const [error, setError] = useState(null);

    useEffect(() => {
      getOffences()
        .then(offences => {
          setOffences(offences);
          setLoading(false);
        })
        .catch(e => {
          setError(e);
          setLoading(false);
        });
    });
  
    return {
      loading,
      offences,
      error: null
    };
  }


function App() {
  const { loading, offences, error} = useOffences();
  if (loading) {
    return <p>Loading...</p>
  }

  return (
    // how to get padding
    <div className="Credentials">
      <RegisterButton />
      <LoginButton />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
