module.exports = {
  module: {
    loaders: [
      {
        test: /plugin\.css$/,
        loaders: [
          'style', 'css',
        ],
      },
    ],
  },
};
