import Users from 'meteor/nova:users';
import { addCallback } from 'meteor/nova:core';
import { operateOnItem } from './vote.js';
import Posts from 'meteor/nova:posts';
import Comments from 'meteor/nova:comments';

/**
 * @summary Make users upvote their own new posts (simulation)
 */
function PostsNewUpvoteOwnPost (post) {
  var postAuthor = Users.findOne(post.userId);
  return {...post, ...operateOnItem(Posts, post, postAuthor, 'upvote', false, 'insert')};
}
addCallback("posts.new.sync", PostsNewUpvoteOwnPost);

/**
 * @summary Make users upvote their own new comments (simulation)
 */
function CommentsNewUpvoteOwnComment (comment) {
  var commentAuthor = Users.findOne(comment.userId);
  return {...comment, ...operateOnItem(Comments, comment, commentAuthor, 'upvote', false, 'insert')};
}
addCallback("comments.new.sync", CommentsNewUpvoteOwnComment);
