const webpack = require("webpack");
const path = require("path");

const BUILD_DIR = path.resolve(__dirname, "public");
const APP_DIR = path.resolve(__dirname, "src");

module.exports = {
  context: APP_DIR,
  entry: "./index.js",
  devtool: "source-map",
  output: {
    filename: "bundle.js",
    path: path.resolve("public/dist")
  },
  devServer: {
    open: true,
    contentBase: BUILD_DIR,
    compress: false,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: false,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.csv$/,
        loader: "url-loader"
      }
    ]
  }
};
