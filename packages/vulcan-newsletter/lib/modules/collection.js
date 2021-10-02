import { createCollection } from 'meteor/vulcan:core';
import schema from './schema';

const Newsletters = createCollection({
  collectionName: 'Newsletters',

  typeName: 'Newsletter',

  resolvers: null,

  mutations: null,
  
  schema,

  generateGraphQLSchema: false
});

export default Newsletters;
