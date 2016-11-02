import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';

// The equation to determine voting power. Defaults to returning 1 for everybody
Telescope.getVotePower = function (user) {
  return 1;
};

Telescope.operateOnItem = function (collection, item, user, operation, isSimulation = false) {

  user = typeof user === "undefined" ? Meteor.user() : user;

  var votePower = Telescope.getVotePower(user);
  var hasUpvotedItem = Users.hasUpvoted(user, item);
  var hasDownvotedItem = Users.hasDownvoted(user, item);
  var update = {};

  // console.log(collection)
  // console.log(item)
  // console.log(user)
  // console.log(operation)

  if (isSimulation) {
    // ------------------------------ Optimistic UI Simulation ------------------------------ //

    const simulatedItem = { 
      __typename: 'Post',
      _id: item._id,
      upvoters: item.upvoters,
      upvotes: item.upvotes,
      baseScore: item.baseScore
    };

    // console.log("// before simulation")
    // console.log(operation)
    // console.log(_.clone(simulatedItem))

    switch (operation) {

      case "upvote": 
        if (hasDownvotedItem) {
          Telescope.operateOnItem(collection, item, user, "cancelDownvote", true);
        }
        simulatedItem.upvoters.push(user._id);
        simulatedItem.upvotes += 1;
        simulatedItem.baseScore += votePower;
        break;

      case "downvote":
        if (hasUpvotedItem) {
          Telescope.operateOnItem(collection, item, user, "cancelUpvote", true);
        }
        simulatedItem.downvoters.push(user._id);
        simulatedItem.downvotes += 1;
        simulatedItem.baseScore -= votePower;

      case "cancelUpvote": 
        simulatedItem.upvoters = _.reject(simulatedItem.upvoters, u => u._id === user._id);
        simulatedItem.upvotes -= 1;
        simulatedItem.baseScore -= votePower;
        break;

      case "cancelDownvote": 
        simulatedItem.downvoters = _.reject(simulatedItem.downvoters, u => u._id === user._id);
        simulatedItem.downvoters -= 1;
        simulatedItem.baseScore += votePower;
        break;
    }

    // console.log("// after simulation")
    // console.log(_.clone(simulatedItem))
    
    return simulatedItem;

  } else {

    // ------------------------------ "Real" Server-Side Operation ------------------------------ //

    // make sure item and user are defined, and user can perform the operation
    if (
      !item ||
      !user || 
      !Users.canDo(user, `${item.getCollectionName()}.${operation}`) || 
      operation === "upvote" && hasUpvotedItem ||
      operation === "downvote" && hasDownvotedItem ||
      operation === "cancelUpvote" && !hasUpvotedItem||
      operation === "cancelDownvote" && !hasDownvotedItem
    ) {
      return false; 
    }

    // ------------------------------ Sync Callbacks ------------------------------ //
    item = Telescope.callbacks.run(operation, item, user);

    switch (operation) {

      case "upvote":

        if (hasDownvotedItem) {
          Telescope.operateOnItem(collection, item, user, "cancelDownvote", isSimulation);
        }
        update = {
          $addToSet: {upvoters: user._id},
          $inc: {upvotes: 1, baseScore: votePower}
        }
        break;

      case "downvote":

        if (hasUpvotedItem) {
          Telescope.operateOnItem(collection, item, user, "cancelUpvote", isSimulation);
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
      
      return item;

    }
  }
};