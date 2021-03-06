/* global __dirname */

const path = require('path');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const dirSrc = path.resolve(__dirname, 'src');
const dirTest = path.resolve(__dirname, 'test');
const dirBuild = path.resolve(__dirname, 'build');
const dirDist = path.resolve(__dirname, 'dist');
const dirDev = path.resolve(__dirname, 'dev');

const args = process.argv.slice(2);

let entry;
let output;
let devtool;
let plugins;

if (args[0] === '-p') {
  entry = [path.resolve(dirSrc, 'index.js')];
  output = {
    path: dirDist,
    filename: 'all.min.js',
    libraryTarget: 'umd',
  };
  plugins = [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
  ];
  devtool = 'source-map';
} else {
  entry = [
    path.resolve(dirSrc, 'index.js')
  ];
  output = {
    path: dirBuild,
    filename: 'bundle.js',
  };
  plugins = [
    // Simply copies the files over
    /*
    new CopyWebpackPlugin([
        { from: dirDev }, // to: output.path
    ]),
    */
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin(),
  ];
  // Create Sourcemaps for the bundle
  devtool = 'source-map';
}

module.exports = {
  entry,
  output,
  plugins,
  devtool,
  devServer: {
    contentBase: dirBuild,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: dirSrc,
      },
      {
        use: 'babel-loader',
        test: dirTest,
      }
    ],
  },
  stats: {
    // Nice colored output
    colors: true,
  },
};
