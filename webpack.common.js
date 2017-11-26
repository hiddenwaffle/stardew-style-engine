const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    bundle: './src/index.ts',
    vendor: [
      '@tweenjs/tween.js'
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.png$/,
        use: 'url-loader'
      },
      {
        test: /\.wav$/, // TODO: Use m4a instead.
        use: 'url-loader'
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts',
      '.js'
    ],
    alias: {
      'src': path.resolve(__dirname, 'src/')
    }
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin( {
      names: ['vendor', 'manifest']
    }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'src/ui/index.html'
    })
  ]
}
