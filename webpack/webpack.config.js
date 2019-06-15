'use strict';

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const dest = path.join(__dirname, '../build');
module.exports = {
  entry: {
    index: path.resolve(__dirname, '../src/scripts/index')
  },
  output: {
    path: dest,
    filename: 'scripts/[name].[hash].min.js'
  },
  plugins: [
    new CleanWebpackPlugin([dest], {
      root: process.cwd()
    }),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, '../public'), to: 'public' }
    ]),
    new HtmlWebpackPlugin({
      chunks: ['index'],
      inject: 'body',
      filename: path.resolve(__dirname, '../build/index.html'),
      template: path.resolve(__dirname, '../src/index.html')
    })
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      }
    ]
  }
};
