/*

The main Comments collection definition file.

*/

import { createCollection, getDefaultResolvers, getDefaultMutations, getDefaultSubscriptions } from 'meteor/vulcan:core';
import schema from './schema.js';
import './fragments.js';
import './permissions.js';

const collectionName = 'Comments';
// avoid conflicts with 'comments' collection in vulcan:comments
const dbCollectionName = 'commentsInstagram';
const typeName = 'Comment';

const Comments = createCollection({

  collectionName,
  
  dbCollectionName,

  typeName,

  schema,
  
  resolvers: getDefaultResolvers(collectionName),

  mutations: getDefaultMutations(collectionName),
  
  subscriptions: getDefaultSubscriptions(collectionName,dbCollectionName)

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
