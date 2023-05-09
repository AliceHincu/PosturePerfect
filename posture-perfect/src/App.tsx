import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { PoseAnalysis } from "./components/PostureAnalysis";

function App() {
  return (
    <div className="App">
      <PoseAnalysis></PoseAnalysis>
    </div>
  );
}

export default App;
