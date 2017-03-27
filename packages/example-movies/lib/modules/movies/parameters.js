import { addCallback } from 'meteor/vulcan:core';

function sortByYear (parameters, terms) {
  return {
    selector: parameters.selector, 
    options: {...parameters.options, sort: {year: -1}}
  };
}

addCallback('movies.parameters', sortByYear);