import React, { Component } from "react";
class Table extends Component {
  static defaultProps = {
    data: []
  };
  renderRow = () => {
    return this.props.data.map((item, i) => {
      return (
        <tr key={i}>
          <td>{item.open}</td>
          <td>{item.close}</td>
          <td>{item.volume}</td>
        </tr>
      );
    });
  };
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Open</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRow()}
        </tbody>
      </table>
    );
  }
}
export default Table;
