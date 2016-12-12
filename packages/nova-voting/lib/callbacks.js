import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import { Callbacks } from 'meteor/nova:core';

/**
 * @summary Update an item's (post or comment) score
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */

function updateScore (item, user, collection, operation) {
  Telescope.updateScore({collection: collection, item: item, forceUpdate: true});
}

Callbacks.add("upvote.async", updateScore);
Callbacks.add("downvote.async", updateScore);
Callbacks.add("cancelUpvote.async", updateScore);
Callbacks.add("cancelDownvote.async", updateScore);

/**
 * @summary Update the profile of the user doing the operation
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */

function updateUser (item, user, collection, operation) {

  var update = {};
  var votePower = Telescope.getVotePower(user);
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

  var votePower = Telescope.getVotePower(user);
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
