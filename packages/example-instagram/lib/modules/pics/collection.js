/*

The main Pics collection definition file.

*/

import { createCollection } from 'meteor/vulcan:core';
import schema from './schema.js';
import resolvers from './resolvers.js';
import './fragments.js';
import mutations from './mutations.js';
import './permissions.js';
import './parameters.js';

const Pics = createCollection({

  collectionName: 'pics',

  typeName: 'Pic',

  schema,
  
  resolvers,

  mutations,

});

export default Pics;
