import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { PoseAnalysis } from "./components/PostureAnalysis";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <PoseAnalysis></PoseAnalysis>
      </div>
    </Provider>
  );
}

export default App;
