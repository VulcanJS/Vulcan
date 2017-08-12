import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
// import schema from './schema.js';
import './fragments.js';

const schema = {
  _id: {
    type: String,
    optional: false,
    viewableBy: ['guests'],
  }
};

const Collections = createCollection({
  collectionName: 'Collections',

  typeName: 'Collection',

  schema,

  resolvers: getDefaultResolvers('Sequences'),

  mutations: getDefaultMutations('Sequences'),
});

export default Collections;
