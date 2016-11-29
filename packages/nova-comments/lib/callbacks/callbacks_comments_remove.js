import Telescope, { removeMutation } from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import Comments from '../collection.js';
import Users from 'meteor/nova:users';

const CommentsRemovePostCommenters = (comment, currentUser) => {
  const userId = comment.userId;

  // dec comment count
  Users.update({_id: userId}, {
    $inc:       {'__commentCount': -1}
  });

  // update post
  Posts.update(comment.postId, {
    $inc:       {commentCount: -1},
    // $set:       {lastCommentedAt: new Date()},
    $pull:  {commenters: userId}
  });

  return comment;
};

Telescope.callbacks.add("comments.remove.async", CommentsRemovePostCommenters);

const CommentsRemoveChildrenComments = (comment, currentUser) => {

  const childrenComments = Comments.find({parentCommentId: comment._id}).fetch();

  childrenComments.forEach(childComment => {
    removeMutation({
      action: 'comments.remove',
      collection: Comments,
      document: childComment, 
      currentUser: currentUser,
      validate: false
    });
  });

  return comment;
};

Telescope.callbacks.add("comments.remove.async", CommentsRemovePostCommenters);