

const path = require('path');
const cloneDeep = require('lodash.clonedeep');
const webpack = require('webpack');

const defaults = {
    context: path.resolve(__dirname, 'src'),

    entry: './js-tracker.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        library: 'TrackerAsset',
        libraryTarget: 'umd',
        filename: 'js-tracker.bundle.js'
    },

    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },

    plugins: []
};

const minified = cloneDeep(defaults); // Use const for minified since it's not reassigned
minified.plugins.push(new webpack.optimize.UglifyJsPlugin());
minified.output.filename = 'js-tracker.bundle.min.js';

module.exports = [defaults, minified];
