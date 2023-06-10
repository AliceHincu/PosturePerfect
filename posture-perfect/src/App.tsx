import React, { useState } from "react";
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
