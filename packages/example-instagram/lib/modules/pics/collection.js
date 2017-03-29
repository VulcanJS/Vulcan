/*

The main Pics collection definition file.

*/

import { createCollection } from 'meteor/vulcan:core';
import schema from './schema.js';
import resolvers from './resolvers.js';
import './fragments.js';
import mutations from './mutations.js';
import './permissions.js';

const Pics = createCollection({

  collectionName: 'Pics',

  typeName: 'Pic',

  schema,
  
  resolvers,

  mutations,

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
