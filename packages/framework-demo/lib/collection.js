/*

The main Movies collection definition file.

*/

import schema from './schema.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';
import { createCollection } from 'meteor/nova:core';

const Movies = createCollection({

  collectionName: 'movies',

  typeName: 'Movie',

  schema,
  
  resolvers,

  mutations,

});

export default Movies;
