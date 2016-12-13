import schema from './schema.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';
import { createCollection } from 'meteor/nova:core';


/**
 * @summary The global namespace for Comments.
 * @namespace Comments
 */
 const Comments = createCollection({

   collectionName: 'comments',

   typeName: 'Comment',

   schema,

   resolvers,

   mutations,

 });
export default Comments;
