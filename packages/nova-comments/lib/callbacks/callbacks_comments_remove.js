import { removeMutation, addCallback } from 'meteor/nova:core';
import Posts from "meteor/nova:posts";
import Comments from '../collection.js';
import Users from 'meteor/nova:users';

const CommentsRemovePostCommenters = (comment, currentUser) => {
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
};

addCallback("comments.remove.async", CommentsRemovePostCommenters);

const CommentsRemoveChildrenComments = (comment, currentUser) => {

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
};

addCallback("comments.remove.async", CommentsRemoveChildrenComments);
