var modifyKarma = function (userId, karma) {
  Meteor.users.update({_id: userId}, {$inc: {"telescope.karma": karma}});
};

/**
 * Update an item's (post or comment) score
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */
function updateScore (item, user, collection, operation) {
  Telescope.updateScore({collection: collection, item: item, forceUpdate: true});
}
Telescope.callbacks.add("upvoteAsync", updateScore);
Telescope.callbacks.add("downvoteAsync", updateScore);
Telescope.callbacks.add("cancelUpvoteAsync", updateScore);
Telescope.callbacks.add("cancelDownvoteAsync", updateScore);

/**
 * Update the profile of the user doing the operation
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

  Meteor.users.update({_id: user._id}, update);

}
Telescope.callbacks.add("upvoteAsync", updateUser);
Telescope.callbacks.add("downvoteAsync", updateUser);
Telescope.callbacks.add("cancelUpvoteAsync", updateUser);
Telescope.callbacks.add("cancelDownvoteAsync", updateUser);

/**
 * Update the karma of the item's owner
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
    Meteor.users.update({_id: item.userId}, {$inc: {"telescope.karma": karmaAmount}});
  }

}
Telescope.callbacks.add("upvoteAsync", updateKarma);
Telescope.callbacks.add("downvoteAsync", updateKarma);
Telescope.callbacks.add("cancelUpvoteAsync", updateKarma);
Telescope.callbacks.add("cancelDownvoteAsync", updateKarma);