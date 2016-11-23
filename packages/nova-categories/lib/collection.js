 import Telescope from 'meteor/nova:lib';
 import schema from './schema.js';
 import fragments from './fragments.js';
 import mutations from './mutations.js';
 import resolvers from './resolvers.js';


/**
 * @summary The global namespace for Categories.
 * @namespace Categories
 */
 const Categories = Telescope.createCollection({

   collectionName: 'categories',

   typeName: 'Category',

   schema,

   resolvers,

   mutations,

 });
export default Categories;