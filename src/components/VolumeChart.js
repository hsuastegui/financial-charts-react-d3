import React from "react";
import moment from "moment";
import * as d3 from "d3";
import techan from "techan";
import { withFauxDOM } from "react-faux-dom";
import "./VolumeChart.css";

class VolumeChart extends React.Component {
  static defaultProps = {
    chart: "loading"
  };
  componentDidMount() {
    this.buildChart();
  }
  render() {
    return (
      <section className="volumeChart">
        <h2 className="title">Volume Chart</h2>
        <div className="chart">
          {this.props.chart}
        </div>
      </section>
    );
  }
  buildChart = () => {
    d3.csv(this.props.data, this.formatData, (error, data) => {
      const faux = this.props.connectFauxDOM("svg", "chart");
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const width = 960 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      let x = techan.scale.financetime().range([0, width]);
      x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
      const y = d3.scaleLinear().range([height, 0]);

      const volume = techan.plot
        .volume()
        .accessor(techan.accessor.ohlc()) // For volume bar highlighting
        .xScale(x)
        .yScale(y);
      const accessor = volume.accessor();

      const xAxis = d3.axisBottom(x);
      const yAxis = d3.axisLeft(y).tickFormat(d3.format(",.3s"));

      const currentData = data
        .slice(0, 100)
        .sort((a, b) => {
          return d3.ascending(accessor.d(a), accessor.d(b));
        })
        .map(d => {
          d.date = moment(d.date).format("DD-MM-YY");
          return d;
        });

      x.domain(currentData.map(accessor.d));
      y.domain(techan.scale.plot.volume(currentData, accessor.v).domain());

      const svg = d3
        .select(faux)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g").attr("class", "volume").datum(currentData).call(volume);

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
    });
  };
  formatData = d => {
    const parseDate = d3.timeParse("%d-%b-%y");
    return {
      date: parseDate(d.Date),
      volume: +d.Volume,
      open: +d.Open,
      high: +d.High,
      low: +d.Low,
      close: +d.Close
    };
  };
}

export default withFauxDOM(VolumeChart);
