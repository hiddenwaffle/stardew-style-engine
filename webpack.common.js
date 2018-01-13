const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * Everything but the index.html should go under the ./world directory.
 */
const worldDirectory = 'world';

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
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.png$/,
        use: {
          loader: 'file-loader',
          options: {
            name: `${worldDirectory}/${process.env.NODE_ENV === 'production' ? '[hash].[ext]' : '[path][name].[ext]'}`
          }
        }
      },
      {
        test: /\.webm$/,
        use: {
          loader: 'file-loader',
          options: {
            name: `${worldDirectory}/${process.env.NODE_ENV === 'production' ? '[hash].[ext]' : '[path][name].[ext]'}`
          }
        }
      },
      {
        // Lazy load *.map.json files instead of inlining them.
        test: /\.map\.json$/,
        use: {
          loader: 'file-loader',
          options: {
            name: `${worldDirectory}/${process.env.NODE_ENV === 'production' ? '[hash].[ext]' : '[path][name].[hash].[ext]'}`
          }
        }
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
    filename: `${worldDirectory}/[name].[chunkhash].js`,
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
