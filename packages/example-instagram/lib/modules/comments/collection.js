/*

The main Comments collection definition file.

*/

import { createCollection } from 'meteor/vulcan:core';
import schema from './schema.js';
import resolvers from './resolvers.js';
import './fragments.js';
import mutations from './mutations.js';
import './permissions.js';

const Comments = createCollection({

  collectionName: 'comments',

  typeName: 'Comment',

  schema,
  
  resolvers,

  mutations,

});

Comments.addView('picComments', function (terms) {
  return {
    selector: {picId: terms.picId},
    options: {sort: {createdAt: 1}}
  };
});

export default Comments;
