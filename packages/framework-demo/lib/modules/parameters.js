/*

Add a new parameter callback that sorts movies by 'createdAt' property.

We use a callback instead of defining the sort in the resolver so that
the same sort can be used on the client, too. 

*/

import { addCallback } from 'meteor/nova:core';

function sortByCreatedAt (parameters, terms) {
  return {
    selector: parameters.selector, 
    options: {...parameters.options, sort: {createdAt: -1}}
  };
}

addCallback("movies.parameters", sortByCreatedAt);