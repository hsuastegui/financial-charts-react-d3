import React, { Component } from "react";
import CandleStick from "./components/CandleStick";
import VolumeChart from "./components/VolumeChart";
import Bar from "./components/Bar";
import "./App.css";
import data from "./data/data.csv";
import letters from "./data/letters.csv";

class App extends Component {
  render() {
    return (
      <div className="App">
        <CandleStick data={data} />
        <VolumeChart data={data} />
        <Bar type="horizontal" data={letters} />
        <Bar type="vertical" data={letters} />
      </div>
    );
  }
}

export default App;
