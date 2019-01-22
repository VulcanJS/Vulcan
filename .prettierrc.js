'use strict';

const {esNextPaths} = require('./.vulcan/shared/pathsByLanguageVersion');

module.exports = {
  bracketSpacing: true,
  singleQuote: true,
  jsxBracketSameLine: true,
  trailingComma: 'es5',
  printWidth: 100,
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
