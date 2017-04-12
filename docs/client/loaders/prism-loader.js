/* eslint-disable */
'use strict';

var loaderUtils = require('loader-utils');
var Prism = require('prismjs');

module.exports = function (content) {
  this.cacheable();

  var query = loaderUtils.getOptions(this);
  if (!query.language) {
    throw new Error('You must provide a `language` query parameter');
  }

  if (!Prism.languages[query.language]) {
    require('prismjs/components/prism-' + query.language + '.js');
  }

  var language = Prism.languages[query.language];
  var value = Prism.highlight(content, language);
  return 'module.exports = ' + JSON.stringify(value);
};

module.exports.seperable = true;
