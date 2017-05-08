import { createCollection } from 'meteor/vulcan:core';
import schema from './schema.js';
import resolvers from './resolvers.js';

const Places = createCollection({

  collectionName: 'Places',

  typeName: 'Place',

  schema,
  
  resolvers,

});

Places.addDefaultView(terms => {
  return {
    options: {sort: {createdAt: -1}}
  };
});

export default Places;