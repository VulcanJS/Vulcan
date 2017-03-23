import marked from 'marked';
import Posts from "meteor/vulcan:posts";
import Comments from '../collection.js';
import Users from 'meteor/vulcan:users';
import { addCallback, Utils, getSetting } from 'meteor/vulcan:core';

// ------------------------------------- comments.new.validate -------------------------------- //

function CommentsNewRateLimit (comment, user) {
  if (!Users.isAdmin(user)) {
    const timeSinceLastComment = Users.timeSinceLast(user, Comments);
    const commentInterval = Math.abs(parseInt(getSetting('commentInterval',15)));

    // check that user waits more than 15 seconds between comments
    if((timeSinceLastComment < commentInterval)) {
      throw new Error(Utils.encodeIntlError({id: "comments.rate_limit_error", value: commentInterval-timeSinceLastComment}));
    }
  }
  return comment;
}
addCallback("comments.new.validate", CommentsNewRateLimit);

// ------------------------------------- comments.new.sync -------------------------------- //

function CommentsNewGenerateHTMLBody (comment, user) {
  comment.htmlBody = Utils.sanitize(marked(comment.body));
  return comment;
}
addCallback("comments.new.sync", CommentsNewGenerateHTMLBody);

function CommentsNewOperations (comment) {

  var userId = comment.userId;

  // increment comment count
  Users.update({_id: userId}, {
    $inc:       {'commentCount': 1}
  });

  // update post
  Posts.update(comment.postId, {
    $inc:       {commentCount: 1},
    $set:       {lastCommentedAt: new Date()},
    $addToSet:  {commenters: userId}
  });

  return comment;
}
addCallback("comments.new.sync", CommentsNewOperations);
