import React, { Component } from "react";
import * as d3 from "d3";
import Table from "./components/Table";
import CandleStick from "./components/CandleStick";
import VolumeChart from "./components/VolumeChart";
import Line from "./components/Line";
import { formatData } from "./util";
import { dataStream } from "./util/Observers";
import "./App.css";
import csvData from "./data/data.csv";
import letters from "./data/letters.csv";

class App extends Component {
  state = {
    data: [],
    currentData: []
  };
  componentDidMount() {
    d3.csv(csvData, formatData, (error, data) => {
      const sortedData = data.sort((a, b) => {
        return d3.ascending(a.date, b.date);
      });
      this.setState({
        data: sortedData
      });
      const pipe = dataStream(sortedData);
      pipe.subscribe(value => {
        this.setState({
          currentData: value
        });
      });
    });
  }
  render() {
    return (
      <div className="App container">
        <div className="tile is-ancestor">
          <div className="tile is-parent is-6 is-vertical">
            <div className="tile is-child box">
              <CandleStick
                data={this.state.currentData}
                total={this.state.data}
              />
            </div>
            <div className="tile is-child box">
              <VolumeChart
                data={this.state.currentData}
                total={this.state.data}
              />
            </div>
          </div>
          <div className="tile is-parent  is-6 is-vertical">
            <div className="tile is-child box">
              <Line data={this.state.currentData} total={this.state.data} />
            </div>
            <div className="tile is-child box">
              <Table data={this.state.currentData} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
