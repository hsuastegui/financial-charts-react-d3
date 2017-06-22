import { timeParse } from "d3";

export const margin = { top: 0, right: 0, bottom: 20, left: 40 };
export const width = 960 - margin.left - margin.right;
export const height = 500 - margin.top - margin.bottom;

export const formatData = d => {
  const parseDate = timeParse("%d-%b-%y");
  return {
    date: parseDate(d.Date),
    volume: +d.Volume,
    open: +d.Open,
    high: +d.High,
    low: +d.Low,
    close: +d.Close
  };
};
