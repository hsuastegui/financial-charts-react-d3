import React from "react";
import * as d3 from "d3";
import techan from "techan";
import ReactFauxDOM from "react-faux-dom";
import { formatData, margin, width, height } from "../util";
import "./VolumeChart.css";

class VolumeChart extends React.Component {
  state = {
    data: [],
    currentData: []
  };
  componentDidMount() {
    d3.csv(this.props.data, formatData, (error, data) => {
      const sortedData = data.sort((a, b) => {
        return d3.ascending(a.date, b.date);
      });
      this.setState({
        data: sortedData,
        currentData: sortedData.slice(0, 100)
      });
    });
  }
  render() {
    return (
      <section className="volumeChart">
        <h2 className="title">Volume Chart</h2>
        <div className="chart">
          {this.buildChart(this.state.currentData)}
        </div>
      </section>
    );
  }
  buildChart = data => {
    const faux = ReactFauxDOM.createElement("svg");
    faux.setAttribute("class", "chart");

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.date))
      .rangeRound([0, width])
      .padding(0.1);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.volume)])
      .range([height, 0]);

    const xAxis = d3
      .axisBottom(x)
      .tickValues(x.domain().filter((d, i) => !(i % 10)))
      .tickFormat(d3.timeFormat("%-d/%-m/%y"));
    const yAxis = d3.axisLeft(y).tickFormat(d3.format(",.3s"));

    const volume = techan.plot
      .volume()
      .accessor(techan.accessor.ohlc()) // For volume bar highlighting
      .xScale(x)
      .yScale(y);

    const svg = d3
      .select(faux)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g").attr("class", "volume").datum(data).call(volume);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    //svg.selectAll("g.x.axis .tick text").attr("transform", "rotate(-90)");

    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Volume");

    return faux.toReact();
  };
}

export default VolumeChart;
