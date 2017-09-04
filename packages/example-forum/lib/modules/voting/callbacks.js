import { addCallback, runCallbacksAsync } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import Posts from '../posts/index.js';
import Comments from '../comments/index.js';
import { operateOnItem } from 'meteor/vulcan:voting';

// -------------------------- posts.new.sync ------------------------------- //

/**
 * @summary Make users upvote their own new posts
 */
function PostsNewUpvoteOwnPost(post) {
  var postAuthor = Users.findOne(post.userId);
  return {...post, ...operateOnItem(Posts, post, postAuthor, 'upvote', false)};
}

addCallback("posts.new.sync", PostsNewUpvoteOwnPost);


// ----------------------- comments.new.sync ------------------------------- //

/**
 * @summary Make users upvote their own new comments
 */
function CommentsNewUpvoteOwnComment(comment) {
  var commentAuthor = Users.findOne(comment.userId);
  return {...comment, ...operateOnItem(Comments, comment, commentAuthor, 'upvote', false)};
}

addCallback("comments.new.sync", CommentsNewUpvoteOwnComment);

// ----------------------- posts.new.async --------------------------------- //
// ----------------------- comments.new.async ------------------------------ //

/**
 * @summary Run the "upvote.async" callbacks *once* the item exists in the database
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 */
function UpvoteAsyncCallbacksAfterDocumentInsert(item, user, collection) {
  runCallbacksAsync("upvote.async", item, user, collection, 'upvote');
}

addCallback("posts.new.async", UpvoteAsyncCallbacksAfterDocumentInsert);
addCallback("comments.new.async", UpvoteAsyncCallbacksAfterDocumentInsert);
