import { addCallback } from 'meteor/vulcan:core';

function sortByCreatedAt (parameters, terms) {
  return {
    selector: parameters.selector, 
    options: {...parameters.options, sort: {createdAt: -1}}
  };
}

addCallback('pics.parameters', sortByCreatedAt);