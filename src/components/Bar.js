import React from "react";
import * as d3 from "d3";
import ReactFauxDOM from "react-faux-dom";
import { margin, width, height } from "../util";

import "./Bar.css";

class Bar extends React.Component {
  state = {
    data: []
  };
  static defaultProps = {
    chart: "loading",
    type: "vertical"
  };
  componentDidMount() {
    d3.csv(this.props.data, this.forceNumber, (error, data) => {
      this.setState({
        data
      });
    });
  }
  render() {
    return (
      <section className="barChart">
        <h2 className="title">
          <span className="chartType">{this.props.type}</span> Bar Chart
        </h2>
        <div className="chart">
          {this.props.type === "horizontal"
            ? this.horizontalBars(this.state.data)
            : null}
          {this.props.type === "vertical"
            ? this.verticalBars(this.state.data)
            : null}
        </div>
      </section>
    );
  }
  horizontalBars = data => {
    const faux = ReactFauxDOM.createElement("svg");
    faux.setAttribute("class", "chart");

    const x = d3.scaleLinear().range([0, width]).domain([
      0,
      d3.max(data, function(d) {
        return d.value;
      })
    ]);
    const y = d3
      .scaleBand()
      .domain(
        data.map(function(d) {
          return d.name;
        })
      )
      .rangeRound([0, height]);
    const xAxis = d3.axisBottom(x).ticks(10, "%");
    const yAxis = d3.axisLeft(y);
    const barHeight = y.bandwidth();

    const chart = d3
      .select(faux)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    chart
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    chart.append("g").attr("class", "y axis").call(yAxis);

    const bar = chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("height", barHeight)
      .attr("transform", function(d, i) {
        return "translate(0," + i * barHeight + ")";
      });

    bar
      .append("rect")
      .attr("width", function(d) {
        return x(d.value);
      })
      .attr("height", barHeight - 1);

    bar
      .append("text")
      .attr("x", function(d) {
        return x(d.value) - 3;
      })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) {
        return d.value;
      });
    return faux.toReact();
  };
  verticalBars = data => {
    const faux = ReactFauxDOM.createElement("svg");
    faux.setAttribute("class", "chart");

    const x = d3
      .scaleBand()
      .domain(
        data.map(function(d) {
          return d.name;
        })
      )
      .rangeRound([0, width]);
    const y = d3.scaleLinear().range([height, 0]).domain([
      0,
      d3.max(data, function(d) {
        return d.value;
      })
    ]);
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y).ticks(10, "%");
    const barWidth = x.bandwidth();

    const chart = d3
      .select(faux)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    chart
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");

    chart
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "legend")
      .attr("y", 0)
      .attr("dy", ".71em")
      .text("Frequency");

    const bar = chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("width", barWidth)
      .attr("transform", function(d, i) {
        return "translate(" + i * barWidth + ",0)";
      })
      .on("click", d => {
        console.log(d.name, d.value);
      })
      .on("mouseover", d => {
        console.log(d.name, d.value);
      });

    bar
      .append("rect")
      .attr("y", function(d) {
        return y(d.value);
      })
      .attr("height", function(d) {
        return height - y(d.value);
      })
      .attr("width", barWidth);
    return faux.toReact();
  };
  forceNumber = d => {
    d.value = +d.value; // coerce to number
    return d;
  };
}

export default Bar;
