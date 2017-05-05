import { removeMutation, addCallback } from 'meteor/vulcan:core';
import Posts from "meteor/vulcan:posts";
import Comments from '../collection.js';
import Users from 'meteor/vulcan:users';

function CommentsRemovePostCommenters (comment, currentUser) {
  const { userId, postId } = comment;

  // dec user's comment count
  Users.update({_id: userId}, {
    $inc:       {'commentCount': -1}
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

addCallback("comments.remove.async", CommentsRemovePostCommenters);

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

addCallback("comments.remove.async", CommentsRemoveChildrenComments);
