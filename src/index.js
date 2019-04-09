import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

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
      <p>Crime statistics</p>
      <button onClick={fetchToken}>Login!</button>
    </div >
  )
}

function LikeCounter() {
  const [count, setCount] = useState(0);
  const [superLike, setSuperCount] = useState(0);
  const increment = () => {
    setCount(oldCount => oldCount + 1);
  };

  const decrement = () => {
    if (count > 0) setCount(oldCount => oldCount - 1);
  };

  const superLikes = () => {
    if (superLike < 2) {
      setCount(oldCount => oldCount + 10);
      setSuperCount(superLike => superLike + 1);
    }
  };
  return (
    // how to get padding
    <div>
      <p>Like Count: {count}</p>
      <button onClick={increment}>Like</button>
      <button onClick={superLikes}>Superlike</button>
      <button onClick={decrement}>Dislike</button>
    </div>
  );
}

function Headline(props) {
  return (
    <div>
      <h1>{props.title}</h1>
      <LikeCounter />
    </div>
  );
}

function App() {
  const headlines = [
    { title: "My First Title", url: "https://news.com/first-title" },
    { title: "My Second Title", url: "https://news.com/second-title" },
    { title: "My Third Title", url: "https://news.com/third-title" },
    { title: "My Fourth Title", url: "https://news.com/fourth-title" }
  ];

  return (
    // how to get padding
    <div className="App">
      {headlines.map(headline => (
        <Headline key={headline.url} title={headline.title} />
      ))}
      <LoginButton />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
