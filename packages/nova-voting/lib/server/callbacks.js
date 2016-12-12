import Users from 'meteor/nova:users';
import { Callbacks } from 'meteor/nova:core';
import { operateOnItem, getVotePower } from '../vote.js';
import Posts from 'meteor/nova:posts';
import Comments from 'meteor/nova:comments';

/**
 * @summary Update an item's (post or comment) score
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */

function updateScoreCallback (item, user, collection, operation) {
  updateScore({collection: collection, item: item, forceUpdate: true});
}

Callbacks.add("upvote.async", updateScoreCallback);
Callbacks.add("downvote.async", updateScoreCallback);
Callbacks.add("cancelUpvote.async", updateScoreCallback);
Callbacks.add("cancelDownvote.async", updateScoreCallback);

/**
 * @summary Update the profile of the user doing the operation
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */

function updateUser (item, user, collection, operation) {

  var update = {};
  var votePower = getVotePower(user);
  var vote = {
    itemId: item._id,
    votedAt: new Date(),
    power: votePower
  };

  switch (operation) {
    case "upvote":
      update.$addToSet = {'__upvotedPosts': vote};
      break;
    case "downvote":
      update.$addToSet = {'__downvotedPosts': vote};
      break;
    case "cancelUpvote":
      update.$pull = {'__upvotedPosts': {itemId: item._id}};
      break;
    case "cancelDownvote":
      update.$pull = {'__downvotedPosts': {itemId: item._id}};
      break;
  }

  Users.update({_id: user._id}, update);

}
Callbacks.add("upvote.async", updateUser);
Callbacks.add("downvote.async", updateUser);
Callbacks.add("cancelUpvote.async", updateUser);
Callbacks.add("cancelDownvote.async", updateUser);

/**
 * @summary Update the karma of the item's owner
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */


function updateKarma (item, user, collection, operation) {

  var votePower = getVotePower(user);
  var karmaAmount = (operation === "upvote" || operation === "cancelDownvote") ? votePower : -votePower;

  // only update karma is the operation isn't done by the item's author
  if (item.userId !== user._id) {
    Users.update({_id: item.userId}, {$inc: {"__karma": karmaAmount}});
  }

}
Callbacks.add("upvote.async", updateKarma);
Callbacks.add("downvote.async", updateKarma);
Callbacks.add("cancelUpvote.async", updateKarma);
Callbacks.add("cancelDownvote.async", updateKarma);

/**
 * @summary Make users upvote their own new posts
 */
function PostsNewUpvoteOwnPost (post) {
  var postAuthor = Users.findOne(post.userId);
  operateOnItem(Posts, post, postAuthor, "upvote");
}
Callbacks.add("posts.new.async", PostsNewUpvoteOwnPost);

/**
 * @summary Make users upvote their own new comments
 */
function CommentsNewUpvoteOwnComment (comment) {
  var commentAuthor = Users.findOne(comment.userId);
  operateOnItem(Comments, comment, commentAuthor, "upvote");
  return comment;
}
Callbacks.add("comments.new.async", CommentsNewUpvoteOwnComment);
