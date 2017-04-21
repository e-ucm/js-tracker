'use strict';

const path = require('path');
const jquery = require('jquery');
const cloneDeep = require('lodash.clonedeep');
const webpack = require("webpack");

const defaults = {
  context: path.resolve(__dirname, "src"),

  entry: "./js-tracker.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    library: "TrackerAsset",
    libraryTarget: "umd",
    filename: "js-tracker.bundle.js",
  },

  plugins : [],
};

var minified = cloneDeep(defaults);
minified.plugins.push(new webpack.optimize.UglifyJsPlugin());
minified.output.filename = "js-tracker.bundle.min.js";

module.exports = [defaults, minified];