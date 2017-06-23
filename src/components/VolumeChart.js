import React from "react";
import * as d3 from "d3";
import techan from "techan";
import ReactFauxDOM from "react-faux-dom";
import { margin, width, height } from "../util";
import { resizeObserver } from "../util/Observers";
import "./VolumeChart.css";

class VolumeChart extends React.Component {
  state = {
    width: width
  };
  static defaultProps = {
    data: []
  };
  componentDidMount() {
    const element = document.getElementById("volume");
    this.setState({
      width: element.clientWidth - margin.left - margin.right
    });
    resizeObserver.subscribe(() => {
      this.setState({
        width: element.clientWidth - margin.left - margin.right
      });
    });
  }
  render() {
    return (
      <section className="volumeChart" id="volume">
        <h2 className="title">Volume Chart</h2>
        <div className="chart">
          {this.buildChart(this.props.data, this.state.width)}
        </div>
      </section>
    );
  }
  buildChart = (data, width) => {
    const faux = ReactFauxDOM.createElement("svg");
    faux.setAttribute("class", "chart");

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, d => d.date))
      .rangeRound([0, width]);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.props.total, d => d.volume)])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x).ticks(4, d3.timeFormat("%-d/%-m/%y"));
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
