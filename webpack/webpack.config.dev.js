'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const {DefinePlugin} = require('webpack');
const path = require('path');

const dest = path.join(__dirname, '../build');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-eval-source-map',
    devServer: {
        contentBase: dest,
        inline: true,
        overlay: true,
        port: 80
    },
    plugins: [
        new DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.s?css$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
})