'use strict';

const {esNextPaths} = require('./.vulcan/shared/pathsByLanguageVersion');

module.exports = {
  bracketSpacing: false,
  singleQuote: true,
  jsxBracketSameLine: true,
  trailingComma: 'es5',
  printWidth: 80,
  parser: 'babylon',

  overrides: [
    {
      files: esNextPaths,
      options: {
        trailingComma: 'all',
      },
    },
  ],
};