import Users from 'meteor/nova:users';
import { addCallback } from 'meteor/nova:core';
import { updateScore } from './scoring.js';
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

addCallback("upvote.async", updateScoreCallback);
addCallback("downvote.async", updateScoreCallback);
addCallback("cancelUpvote.async", updateScoreCallback);
addCallback("cancelDownvote.async", updateScoreCallback);

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
      update.$addToSet = {'upvotedPosts': vote};
      break;
    case "downvote":
      update.$addToSet = {'downvotedPosts': vote};
      break;
    case "cancelUpvote":
      update.$pull = {'upvotedPosts': {itemId: item._id}};
      break;
    case "cancelDownvote":
      update.$pull = {'downvotedPosts': {itemId: item._id}};
      break;
  }

  Users.update({_id: user._id}, update);

}
addCallback("upvote.async", updateUser);
addCallback("downvote.async", updateUser);
addCallback("cancelUpvote.async", updateUser);
addCallback("cancelDownvote.async", updateUser);

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
    Users.update({_id: item.userId}, {$inc: {"karma": karmaAmount}});
  }

}
addCallback("upvote.async", updateKarma);
addCallback("downvote.async", updateKarma);
addCallback("cancelUpvote.async", updateKarma);
addCallback("cancelDownvote.async", updateKarma);

/**
 * @summary Make users upvote their own new posts
 */
function PostsNewUpvoteOwnPost (post) {
  var postAuthor = Users.findOne(post.userId);
  operateOnItem(Posts, post, postAuthor, "upvote");
}
addCallback("posts.new.async", PostsNewUpvoteOwnPost);

/**
 * @summary Make users upvote their own new comments
 */
function CommentsNewUpvoteOwnComment (comment) {
  var commentAuthor = Users.findOne(comment.userId);
  operateOnItem(Comments, comment, commentAuthor, "upvote");
  return comment;
}
addCallback("comments.new.async", CommentsNewUpvoteOwnComment);
