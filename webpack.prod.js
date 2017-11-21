const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  plugins: [
    // new BundleAnalyzerPlugin(),
    new UglifyJsPlugin()
  ]
});
