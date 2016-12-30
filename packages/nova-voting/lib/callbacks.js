import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';

/**
 * @summary Update an item's (post or comment) score
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */
const updateScore = (item, user, collection, operation) => {
  Telescope.updateScore({collection: collection, item: item, forceUpdate: true});
}

Telescope.callbacks.add("upvote.async", updateScore);
Telescope.callbacks.add("downvote.async", updateScore);
Telescope.callbacks.add("cancelUpvote.async", updateScore);
Telescope.callbacks.add("cancelDownvote.async", updateScore);

/**
 * @summary Update the profile of the user doing the operation
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */

const updateUser = (item, user, collection, operation) => {
  let update = {};
  const votePower = Telescope.getVotePower(user);
  const vote = {
    itemId: item._id,
    votedAt: new Date(),
    power: votePower
  };

  switch (operation) {
    case "upvote":
      update.$addToSet = {'telescope.upvotedPosts': vote};
      break;
    case "downvote":
      update.$addToSet = {'telescope.downvotedPosts': vote};
      break;
    case "cancelUpvote":
      update.$pull = {'telescope.upvotedPosts': {itemId: item._id}};
      break;
    case "cancelDownvote":
      update.$pull = {'telescope.downvotedPosts': {itemId: item._id}};
      break;
  }

  Users.update({_id: user._id}, update);

}

Telescope.callbacks.add("upvote.async", updateUser);
Telescope.callbacks.add("downvote.async", updateUser);
Telescope.callbacks.add("cancelUpvote.async", updateUser);
Telescope.callbacks.add("cancelDownvote.async", updateUser);

/**
 * @summary Update the karma of the item's owner
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */
const updateKarma = (item, user, collection, operation) => {

  const votePower = Telescope.getVotePower(user);
  const karmaAmount = (operation === "upvote" || operation === "cancelDownvote") ? votePower : -votePower;

  // only update karma is the operation isn't done by the item's author
  if (item.userId !== user._id) {
    Users.update({_id: item.userId}, {$inc: {"telescope.karma": karmaAmount}});
  }

}

Telescope.callbacks.add("upvote.async", updateKarma);
Telescope.callbacks.add("downvote.async", updateKarma);
Telescope.callbacks.add("cancelUpvote.async", updateKarma);
Telescope.callbacks.add("cancelDownvote.async", updateKarma);
