/*

The main Movies collection definition file.

*/

import { createCollection } from 'meteor/nova:core';
import schema from './schema.js';
import resolvers from './resolvers.js';
import mutations from './mutations.js';

const Movies = createCollection({

  collectionName: 'movies',

  typeName: 'Movie',

  schema,
  
  resolvers,

  mutations,

});

export default Movies;
