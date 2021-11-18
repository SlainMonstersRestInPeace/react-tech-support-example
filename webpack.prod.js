const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require('webpack-merge');
const common = require("./webpack.common");

const index = new HtmlWebpackPlugin({
  template: './src/template/index.pug',
  filename: 'index.html',
  chunks: ['index']
});

module.exports = merge(common, {
  mode: 'production',
  entry: {
    index: "./src/index.js"
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    index
  ]
});