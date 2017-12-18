/*

The main Movies collection definition file.

*/

import { createCollection } from 'meteor/vulcan:core';
import schema from './schema.js';
import resolvers from './resolvers.js';
import './fragments.js';
import mutations from './mutations.js';
import './permissions.js';
import './parameters.js';

import { ormCollection } from './api';

const Movies = createCollection({

  collectionName: 'Movies',

  typeName: 'Movie',

  schema,
  
  ormCollection,

  resolvers,

  mutations,

});

export default Movies;
