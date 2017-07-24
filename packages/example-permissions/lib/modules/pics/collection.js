/*

The main Pics collection definition file.

*/

import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import schema from './schema.js';
import './fragments.js';

const Pics = createCollection({

  collectionName: 'Pics',

  typeName: 'Pic',

  schema,
  
  resolvers: getDefaultResolvers('Pics'),

  mutations: getDefaultMutations('Pics'),

});

/*

Set a default results view whenever the Pics collection is queried:

- Pics are sorted by their createdAt timestamp in descending order

*/

Pics.addDefaultView(terms => {
  return {
    options: {sort: {createdAt: -1}}
  };
});

export default Pics;
