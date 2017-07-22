/*

The main Categories collection definition file.

*/

import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import schema from './schema.js';
import './fragments.js';
import './permissions.js';

const Categories = createCollection({

  collectionName: 'Categories',

  typeName: 'Category',

  schema,
  
  resolvers: getDefaultResolvers('Categories'),

  mutations: getDefaultMutations('Categories'),

  interfaces: ['HierarchicalInterface'],

});

export default Categories;
