import schema from './schema.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';
import { createCollection } from 'meteor/vulcan:core';


/**
 * @summary The global namespace for Categories.
 * @namespace Categories
 */
 const Categories = createCollection({

   collectionName: 'Categories',

   typeName: 'Category',

   schema,

   resolvers,

   mutations,

 });
export default Categories;