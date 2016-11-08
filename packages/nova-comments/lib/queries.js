import Telescope from 'meteor/nova:lib';
import Comments from './collection.js';

// declare comments queries
Telescope.graphQL.addQuery(`
  comments(postId: String): [Comment]
  comment(_id: String): Comment
`);

Comments.graphQLQueries = {
  single: `
    _id
    postId
    parentCommentId
    topLevelCommentId
    body
    htmlBody
    postedAt
    user {
      _id
      telescope {
        slug
        emailHash # used for the avatar
      }
    }
  `
}
