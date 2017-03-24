import Comments from '../collection.js';
import { addCallback } from 'meteor/vulcan:core';

function UsersRemoveDeleteComments (user, options) {
  if (options.deleteComments) {
    Comments.remove({userId: user._id});
  } else {
    // not sure if anything should be done in that scenario yet
    // Comments.update({userId: userId}, {$set: {author: "\[deleted\]"}}, {multi: true});
  }
}
addCallback("users.remove.async", UsersRemoveDeleteComments);

// Add to posts.single publication

function PostsSingleAddCommentsUsers (users, post) {
  // get IDs from all commenters on the post
  const comments = Comments.find({postId: post._id}).fetch();
  if (comments.length) {
    users = users.concat(_.pluck(comments, "userId"));
  }
  return users;
}
addCallback("posts.single.getUsers", PostsSingleAddCommentsUsers);
