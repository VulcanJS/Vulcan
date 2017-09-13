import Users from 'meteor/vulcan:users';
import { addCallback, getSetting } from 'meteor/vulcan:core';

import Comments from '../../../modules/comments/index.js';

function CommentsNewRateLimit (comment, user) {
  if (!Users.isAdmin(user)) {
    const timeSinceLastComment = Users.timeSinceLast(user, Comments);
    const commentInterval = Math.abs(parseInt(getSetting('commentInterval',15)));

    // check that user waits more than 15 seconds between comments
    if((timeSinceLastComment < commentInterval)) {
      throw new Error(Utils.encodeIntlError({id: 'comments.rate_limit_error', value: commentInterval-timeSinceLastComment}));
    }
  }
  return comment;
}
addCallback('comments.new.validate', CommentsNewRateLimit);
