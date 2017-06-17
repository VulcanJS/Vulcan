/*

The main Comments collection definition file.

*/

import { createCollection } from 'meteor/vulcan:core';
import schema from './schema.js';

const Charges = createCollection({

  collectionName: 'Charges',
  
  typeName: 'Charge',

  schema,
  
  // resolvers,

  // mutations,

});

Charges.addDefaultView(terms => {
  return {
    options: {sort: {createdAt: -1}}
  };
});

export default Charges;
