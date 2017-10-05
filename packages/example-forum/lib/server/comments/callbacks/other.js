import Users from 'meteor/vulcan:users';
import { addCallback, runCallbacksAsync, removeMutation } from 'meteor/vulcan:core';

import { Posts } from '../../../modules/posts/index.js';
import { Comments } from '../../../modules/comments/index.js';

//////////////////////////////////////////////////////
// comments.new.sync                                //
//////////////////////////////////////////////////////

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
addCallback('comments.new.sync', CommentsNewOperations);

//////////////////////////////////////////////////////
// comments.new.async                               //
//////////////////////////////////////////////////////


/**
 * @summary Run the 'upvote.async' callbacks *once* the item exists in the database
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 */
function UpvoteAsyncCallbacksAfterDocumentInsert(item, user, collection) {
  runCallbacksAsync('upvote.async', item, user, collection, 'upvote');
}

addCallback('comments.new.async', UpvoteAsyncCallbacksAfterDocumentInsert);

//////////////////////////////////////////////////////
// comments.remove.async                            //
//////////////////////////////////////////////////////

function CommentsRemovePostCommenters (comment, currentUser) {
  const { userId, postId } = comment;

  // dec user's comment count
  Users.update({_id: userId}, {
    $inc: {'commentCount': -1}
  });

  const postComments = Comments.find({postId}, {sort: {postedAt: -1}}).fetch();

  const commenters = _.uniq(postComments.map(comment => comment.userId));
  const lastCommentedAt = postComments[0] && postComments[0].postedAt;

  // update post with a decremented comment count, a unique list of commenters and corresponding last commented at date 
  Posts.update(postId, {
    $inc: {commentCount: -1},
    $set: {lastCommentedAt, commenters},
  });

  return comment;
}

addCallback('comments.remove.async', CommentsRemovePostCommenters);

function CommentsRemoveChildrenComments (comment, currentUser) {

  const childrenComments = Comments.find({parentCommentId: comment._id}).fetch();

  childrenComments.forEach(childComment => {
    removeMutation({
      action: 'comments.remove',
      collection: Comments,
      documentId: childComment._id, 
      currentUser: currentUser,
      validate: false
    });
  });

  return comment;
}

addCallback('comments.remove.async', CommentsRemoveChildrenComments);

//////////////////////////////////////////////////////
// other                                            //
//////////////////////////////////////////////////////

function UsersRemoveDeleteComments (user, options) {
  if (options.deleteComments) {
    Comments.remove({userId: user._id});
  } else {
    // not sure if anything should be done in that scenario yet
    // Comments.update({userId: userId}, {$set: {author: '\[deleted\]'}}, {multi: true});
  }
}
addCallback('users.remove.async', UsersRemoveDeleteComments);
