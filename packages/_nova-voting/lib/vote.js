// The equation to determine voting power. Defaults to returning 1 for everybody
Telescope.getVotePower = function (user) {
  return 1;
};

Telescope.operateOnItem = function (collection, itemId, user, operation) {

  user = typeof user === "undefined" ? Meteor.user() : user;

  var item = collection.findOne(itemId);
  var votePower = Telescope.getVotePower(user);
  var hasUpvotedItem = user.hasUpvotedItem(item);
  var hasDownvotedItem = user.hasDownvotedItem(item);
  var update = {};

  // console.log(collection)
  // console.log(item)
  // console.log(user)
  // console.log(operation)

  // make sure item and user are defined, and user can perform the operation
  if (
    !item ||
    !user || 
    !user.canVote() || 
    operation === "upvote" && hasUpvotedItem ||
    operation === "downvote" && hasDownvotedItem
  ) {
    return false; 
  }

  // ------------------------------ Sync Callbacks ------------------------------ //
  item = Telescope.callbacks.run(operation, item, user);

  switch (operation) {

    case "upvote":

      if (hasDownvotedItem) {
        Telescope.operateOnItem(collection, itemd, user, "cancelDownvote");
      }
      update = {
        $addToSet: {upvoters: user._id},
        $inc: {upvotes: 1, baseScore: votePower}
      }
      break;

    case "downvote":

      if (hasUpvotedItem) {
        Telescope.operateOnItem(collection, itemId, user, "cancelUpvote");
      }
      update = {
        $addToSet: {downvoters: user._id},
        $inc: {downvotes: 1, baseScore: -votePower}
      }
      break;

    case "cancelUpvote":

      update = {
        $pull: {upvoters: user._id},
        $inc: {upvotes: -1, baseScore: -votePower}
      };
      break;

    case "cancelDownvote":

      update = {
        $pull: {downvoters: user._id},
        $inc: {downvotes: -1, baseScore: votePower}
      };
      break;
  }



  update["$set"] = {inactive: false};
  var result = collection.update({_id: item._id}, update);


  if (result > 0) {

    // extend item with baseScore to help calculate newScore
    item = _.extend(item, {baseScore: (item.baseScore + votePower)});
    
    // --------------------- Server-Side Async Callbacks --------------------- //
    Telescope.callbacks.runAsync(operation+".async", item, user, collection, operation);
    
    return true;

  }

};