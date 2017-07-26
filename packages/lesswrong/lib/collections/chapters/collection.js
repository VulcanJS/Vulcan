import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import schema from './schema.js';

const Chapters = createCollection({

  collectionName: 'Chapters',

  typeName: 'Chapter',

  schema,

  resolvers: getDefaultResolvers('Chapters'),

  mutations: getDefaultMutations('Chapters'),
})

export default Chapters;
