import { createCollection, /* getDefaultResolvers, getDefaultMutations */ } from 'meteor/vulcan:core';
import schema from './schema.js';

const Votes = createCollection({

  collectionName: 'Votes',

  typeName: 'Vote',

  schema,
  
  // resolvers: getDefaultResolvers('Votes'),

  // mutations: getDefaultMutations('Votes'),

});


export default Votes;
