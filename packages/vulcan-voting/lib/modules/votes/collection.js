import { createCollection, /* getDefaultResolvers, getDefaultMutations */ } from 'meteor/vulcan:core';
import schema from './schema.js';

const Votes = createCollection({

  collectionName: 'Votes',

  typeName: 'Vote',

  schema,
  
  resolvers: null,

  mutations: null,

});


export default Votes;
