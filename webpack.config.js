const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/js-tracker.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js-tracker.bundle.js'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: "/test/",
        exclude: "/node_modules/",
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
