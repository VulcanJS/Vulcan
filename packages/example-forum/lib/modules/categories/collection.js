/*

The Categories collection

*/

import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import schema from './schema.js';

/**
 * @summary The global namespace for Categories.
 * @namespace Categories
 */
 export const Categories = createCollection({

  collectionName: 'Categories',

  typeName: 'Category',

  schema,

  resolvers: getDefaultResolvers('Categories'),

  mutations: getDefaultMutations('Categories'),

});