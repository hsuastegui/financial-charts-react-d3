import React from "react";
import * as d3 from "d3";
import techan from "techan";
import ReactFauxDOM from "react-faux-dom";
import { margin, width, height } from "../util";
import { resizeObserver } from "../util/Observers";
import "./CandleStick.css";

class CandleStick extends React.Component {
  state = {
    width: width
  };
  static defaultProps = {
    data: []
  };
  componentDidMount() {
    const element = document.getElementById("candleStick");
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
      <section className="candleStick" id="candleStick">
        <h2 className="title">Candlestick Chart</h2>
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
      .domain([
        d3.min(this.props.total, d => d.low),
        d3.max(this.props.total, d => d.high)
      ])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x).ticks(4, d3.timeFormat("%-d/%-m/%y"));
    const yAxis = d3.axisLeft(y);

    const candlestick = techan.plot.candlestick().xScale(x).yScale(y);

    const svg = d3
      .select(faux)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g").attr("class", "candlestick").datum(data).call(candlestick);

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

    return faux.toReact();
  };
}

export default CandleStick;
