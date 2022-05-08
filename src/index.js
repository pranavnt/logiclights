import React from "react";
import ReactDOM from "react-dom";
import init from "./editor";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <div style={{ textAlign: "left", width: "100vw", height: "70vh" }}>
        <div ref={el => init(el)} />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
