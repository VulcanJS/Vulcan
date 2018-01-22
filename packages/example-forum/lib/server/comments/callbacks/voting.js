import Users from 'meteor/vulcan:users';
import { addCallback } from 'meteor/vulcan:core';
import { Comments } from '../../../modules/comments/index.js';

import { performVoteServer } from 'meteor/vulcan:voting';

/**
 * @summary Make users upvote their own new comments
 */
function CommentsNewUpvoteOwnComment(comment) {
  var commentAuthor = Users.findOne(comment.userId);
  const votedComent = performVoteServer({ document: comment, voteType: 'upvote', collection: Comments, user: commentAuthor })
  return {...comment, ...votedComent};
}

addCallback('comments.new.after', CommentsNewUpvoteOwnComment);