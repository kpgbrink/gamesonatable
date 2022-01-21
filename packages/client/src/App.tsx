import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { QueryPayLoad } from "api";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        {/* NEW */}
        <button
          onClick={() => {
            fetch("/data", {})
              .then((response) => response.json())
              .then((data: QueryPayLoad) => console.log(data));
          }}
        >
          GET SOME DATA
        </button>
      </header>
    </div>
  );
}

export default App;
