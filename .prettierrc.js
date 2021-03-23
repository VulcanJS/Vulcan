'use strict';

const {esNextPaths} = require('./.vulcan/shared/pathsByLanguageVersion');

module.exports = {
  bracketSpacing: true,
  singleQuote: true,
  jsxBracketSameLine: true,
  trailingComma: 'es5',
  printWidth: 140,
  parser: '@babel/parser',

  overrides: [
    {
      files: esNextPaths,
      options: {
        trailingComma: 'all',
      },
    },
  ],
};
