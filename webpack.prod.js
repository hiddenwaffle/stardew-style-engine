const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const fileLoaderConfig = {
  loader: 'file-loader',
  options: {
    name: '[hash].[ext]'
  }
};

module.exports = merge(common, {
  module: {
    rules: [
      {
        test: /\.png$/,
        use: fileLoaderConfig
      },
      {
        test: /\.wav$/, // TODO: Use m4a or webm instead.
        use: fileLoaderConfig
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'webpack-bundle-analyzer-report.html',
      openAnalyzer: false
    }),
    new UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});
