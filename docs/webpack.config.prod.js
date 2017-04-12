const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ReactStaticPlugin = require('react-static-webpack-plugin');
const webpackBaseConfig = require('./webpack.config.base');

module.exports = Object.assign(webpackBaseConfig, {
  devtool: 'source-map',

  context: __dirname,

  entry: {
    app: [
      './client/index.js',
    ],
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/',
  },

  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      screw_ie8: true,
      sourceMap: true,
      compressor: { warnings: false },
    }),
    new ReactStaticPlugin({
      routes: './client/routes.js',
      template: './template.js',
    }),
  ],
});
