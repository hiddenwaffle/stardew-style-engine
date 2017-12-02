const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const fileLoaderConfig = {
  loader: 'file-loader',
  options: {
    name: process.env.NODE_ENV === 'production' ? '[hash].[ext]' : '[path][name].[ext]'
  }
};

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
        use: fileLoaderConfig
      },
      {
        test: /\.webm$/,
        use: fileLoaderConfig
      },
      {
        // Lazy load *.map.json files instead of inlining them.
        test: /\.map\.json$/,
        use: fileLoaderConfig
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
