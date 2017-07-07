/*

The main Comments collection definition file.

*/

import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import schema from './schema.js';
import './fragments.js';
import './permissions.js';

const Comments = createCollection({

  collectionName: 'Comments',
  
  // avoid conflicts with 'comments' collection in vulcan:comments
  dbCollectionName: 'commentsInstagram',

  typeName: 'Comment',

  schema,
  
  resolvers: getDefaultResolvers('Comments'),

  mutations: getDefaultMutations('Comments'),

});

/*

Set a default results view whenever the Comments collection is queried:

- Comments are limited to those corresponding to the current picture
- They're sorted by their createdAt timestamp in ascending order

*/

Comments.addDefaultView(terms => {
  return {
    selector: {picId: terms.picId},
    options: {sort: {createdAt: 1}}
  };
});

export default Comments;
