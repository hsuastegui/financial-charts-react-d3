import React from "react";
import * as d3 from "d3";
import techan from "techan";
import ReactFauxDOM from "react-faux-dom";
import { formatData, margin, width, height } from "../util";
import "./CandleStick.css";

class CandleStick extends React.Component {
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
      <section className="candleStick">
        <h2 className="title">Candlestick Chart</h2>
        <button onClick={this.handleMore}>More</button>
        <div className="chart">
          {this.buildChart(this.state.currentData)}
        </div>
      </section>
    );
  }
  handleMore = () => {
    this.setState({ currentData: this.state.data.slice(101, 200) });
  };
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
      .domain([d3.min(data, d => d.close), d3.max(data, d => d.close)])
      .range([height, 0]);

    const xAxis = d3
      .axisBottom(x)
      .tickValues(x.domain().filter((d, i) => !(i % 10)))
      .tickFormat(d3.timeFormat("%-d/%-m/%y"));
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
