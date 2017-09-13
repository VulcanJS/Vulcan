import Users from 'meteor/vulcan:users';
import { addCallback } from 'meteor/vulcan:core';
import Comments from '../../../modules/comments/index.js';

import { operateOnItem } from 'meteor/vulcan:voting';

/**
 * @summary Make users upvote their own new comments
 */
function CommentsNewUpvoteOwnComment(comment) {
  var commentAuthor = Users.findOne(comment.userId);
  return {...comment, ...operateOnItem(Comments, comment, commentAuthor, 'upvote', false)};
}

addCallback('comments.new.sync', CommentsNewUpvoteOwnComment);
