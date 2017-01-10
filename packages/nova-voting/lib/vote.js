import Users from 'meteor/nova:users';
import { hasUpvoted, hasDownvoted } from './helpers.js';
import { runCallbacks, runCallbacksAsync } from 'meteor/nova:core';

// The equation to determine voting power. Defaults to returning 1 for everybody
export const getVotePower = function (user) {
  return 1;
};

export const operateOnItem = function (collection, originalItem, user, operation, isSimulation = false) {

  user = typeof user === "undefined" ? Meteor.user() : user;

  let item = _.clone(originalItem); // we do not want to affect the original item directly

  var votePower = getVotePower(user);
  var hasUpvotedItem = hasUpvoted(user, item);
  var hasDownvotedItem = hasDownvoted(user, item);
  var update = {};

  // console.log('// operateOnItem')
  // console.log(collection)
  // console.log(item)
  // console.log(user)
  // console.log(operation)

  // ---------------------------- "Real" Server-Side Operation -------------------------- //

  const collectionName = collection._name;

  // make sure item and user are defined, and user can perform the operation
  if (
    !item ||
    !user || 
    !Users.canDo(user, `${collectionName}.${operation}`) || 
    operation === "upvote" && hasUpvotedItem ||
    operation === "downvote" && hasDownvotedItem ||
    operation === "cancelUpvote" && !hasUpvotedItem ||
    operation === "cancelDownvote" && !hasDownvotedItem
  ) {
    return false; 
  }

  if (typeof item.upvoters === 'undefined') {
    item.upvoters = [];
  }

  if (typeof item.downvoters === 'undefined') {
    item.downvoters = [];
  }

  // ------------------------------ Sync Callbacks ------------------------------ //

  item = runCallbacks(operation, item, user);

  switch (operation) {

    case "upvote":
      if (hasDownvotedItem) {
        operateOnItem(collection, item, user, "cancelDownvote", isSimulation);
      }

      const upvoter = isSimulation ? {__typename: "User", _id: user._id} : user._id
      item.upvoters.push(upvoter);
      item.upvotes += 1;
      item.baseScore += votePower;
      
      if (!isSimulation) {
        update = {
          $addToSet: {upvoters: user._id},
          $inc: {upvotes: 1, baseScore: votePower}
        }
      }
      break;

    case "downvote":
      if (hasUpvotedItem) {
        operateOnItem(collection, item, user, "cancelUpvote", isSimulation);
      }

      const downvoter = isSimulation ? {__typename: "User", _id: user._id} : user._id
      item.downvoters.push(downvoter);
      item.downvotes += 1;
      item.baseScore -= votePower;
      
      if (!isSimulation) {
        update = {
          $addToSet: {downvoters: user._id},
          $inc: {downvotes: 1, baseScore: -votePower}
        }
      }
      break;

    case "cancelUpvote":
      item.upvoters = item.upvoters.filter(u => typeof u === 'string' ? u !== user._id : u._id !== user._id);
      item.upvotes -= 1;
      item.baseScore -= votePower;
      
      if (!isSimulation) {  
        update = {
          $pull: {upvoters: user._id},
          $inc: {upvotes: -1, baseScore: -votePower}
        };
      }
      break;

    case "cancelDownvote":
      item.downvoters = item.downvoters.filter(u => typeof u === 'string' ? u !== user._id : u._id !== user._id);
      item.downvotes -= 1;
      item.baseScore += votePower;
      
      if (!isSimulation) {
        update = {
          $pull: {downvoters: user._id},
          $inc: {downvotes: -1, baseScore: votePower}
        };
      }
      break;
  }

  if (!isSimulation) {
    update["$set"] = {inactive: false};
    const result = collection.update({_id: item._id}, update);
    
    if (result > 0) {
      // --------------------- Server-Side Async Callbacks --------------------- //
      runCallbacksAsync(operation+".async", item, user, collection, operation); 
    }
  }

  const voteResult = _.pick(item, '__typename', '_id', 'upvoters', 'downvoters', 'upvotes', 'downvotes', 'baseScore');

  // if (isSimulation) {
  //   console.log('item from apollo store', voteResult);
  // } else {
  //   console.log('item from mongo db', voteResult);
  // }

  return voteResult;
};
