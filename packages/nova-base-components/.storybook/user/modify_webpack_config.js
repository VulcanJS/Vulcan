const path = require('path')

module.exports = function (config) {
  // This is the default webpack config defined in the `../webpack.config.js`
  // modify as you need.
  config.module.loaders = [
    {
      test: /\.css?$/,
      loader: 'style!css!',
      include: path.resolve(__dirname, '../../'),
    },
    {
      test: /\.scss$/,
      loader: 'style!css!sass',
      exclude: /node_modules/,
      include: path.resolve(__dirname, '../../'),
    },
    {
      test: /\.sass$/,
      loader: 'style!css!sass?indentedSyntax=sass',
      exclude: /node_modules/,
      include: path.resolve(__dirname, '../../'),
    },
  ]
}
