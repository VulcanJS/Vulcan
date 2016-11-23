 import Telescope from 'meteor/nova:lib';
 import schema from './schema.js';
 import fragments from './fragments.js';
 import mutations from './mutations.js';
 import resolvers from './resolvers.js';


/**
 * @summary The global namespace for Comments.
 * @namespace Comments
 */
 const Comments = Telescope.createCollection({

   collectionName: 'comments',

   typeName: 'Comment',

   schema,

   resolvers,

   mutations,

 });
export default Comments;