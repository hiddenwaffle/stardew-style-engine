const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const fileLoaderConfig = {
  loader: 'file-loader',
  options: {
    name: '[path][name].[ext]'
  }
};

module.exports = merge(common, {
  devtool: 'cheap-module-eval-source-map',
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
});
