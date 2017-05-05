import { addCallback } from 'meteor/vulcan:core';

// limit the number of items that can be requested at once
function CommentsMaxLimit (parameters, terms) {
  var maxLimit = 1000;
  // if a limit was provided with the terms, add it too (note: limit=0 means "no limit")
  if (typeof terms.limit !== 'undefined') {
    _.extend(parameters.options, {limit: parseInt(terms.limit)});
  }

  // limit to "maxLimit" items at most when limit is undefined, equal to 0, or superior to maxLimit
  if(!parameters.options.limit || parameters.options.limit === 0 || parameters.options.limit > maxLimit) {
    parameters.options.limit = maxLimit;
  }
  return parameters;
}

addCallback("comments.parameters", CommentsMaxLimit);
