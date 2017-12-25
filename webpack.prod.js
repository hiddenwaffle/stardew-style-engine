const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'meta/webpack-bundle-analyzer-report.html',
      openAnalyzer: false
    }),
    new UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});
