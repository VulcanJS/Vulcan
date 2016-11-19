import Telescope from 'meteor/nova:lib';
import Comments from './collection.js';

// declare comments queries
Telescope.graphQL.addQuery(`
  commentsList(postId: String, offset: Int, limit: Int): [Comment]
  commentsListTotal(postId: String): Int
  comment(_id: String): Comment
`);
