import Users from 'meteor/nova:users';
import { hasUpvoted, hasDownvoted } from './helpers.js';
import { runCallbacks, runCallbacksAsync } from 'meteor/nova:core';
import update from 'immutability-helper';

// The equation to determine voting power. Defaults to returning 1 for everybody
export const getVotePower = function (user) {
  return 1;
};

const keepVoteProperties = item => _.pick(item, '__typename', '_id', 'upvoters', 'downvoters', 'upvotes', 'downvotes', 'baseScore');

/*

- Simulation mode: runs all the operation and returns an objects without affecting the db.
- Regular mode: same, but updates the db too.

*/
export const operateOnItem = function (collection, originalItem, user, operation, isSimulation = false, context = 'edit') {

  user = typeof user === "undefined" ? Meteor.user() : user;

  let item = {
    upvotes: 0,
    downvotes: 0,
    upvoters: [],
    downvoters: [],
    baseScore: 0,
    ...originalItem,
  }; // we do not want to affect the original item directly

  var votePower = getVotePower(user);
  var hasUpvotedItem = hasUpvoted(user, item);
  var hasDownvotedItem = hasDownvoted(user, item);
  var modifier = {};

  // console.log('// operateOnItem')
  // console.log('isSimulation: ',isSimulation)
  // console.log('context: ',context)
  // console.log('collection: ',collection._name)
  // console.log('operation: ',operation)
  // console.log('item: ',item)
  // console.log('user: ',user)

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

  const voter = isSimulation ? {__typename: "User", _id: user._id} : user._id;

  // ------------------------------ Sync Callbacks ------------------------------ //

  item = runCallbacks(operation, item, user);

  switch (operation) {

    case "upvote":
      if (hasDownvotedItem) {
        operateOnItem(collection, item, user, "cancelDownvote", isSimulation, context);
      }

      item = update(item, {
        upvoters: {$push: [voter]},
        upvotes: {$set: item.upvotes + 1},
        baseScore: {$set: item.baseScore + votePower},
      });
      
      if (!isSimulation) {
        modifier = {
          $addToSet: {upvoters: user._id},
          $inc: {upvotes: 1, baseScore: votePower}
        }
      }
      break;

    case "downvote":
      if (hasUpvotedItem) {
        operateOnItem(collection, item, user, "cancelUpvote", isSimulation, context);
      }

      item = update(item, {
        downvoters: {$push: [voter]},
        downvotes: {$set: item.downvotes + 1},
        baseScore: {$set: item.baseScore - votePower},
      });
      
      if (!isSimulation) {
        modifier = {
          $addToSet: {downvoters: user._id},
          $inc: {downvotes: 1, baseScore: -votePower}
        }
      }
      break;

    case "cancelUpvote":
      item = update(item, {
        upvoters: {$set: item.upvoters.filter(u => u._id !== user._id)},
        upvotes: {$set: item.upvotes - 1},
        baseScore: {$set: item.baseScore - votePower},
      });

      if (!isSimulation) {  
        modifier = {
          $pull: {upvoters: user._id},
          $inc: {upvotes: -1, baseScore: -votePower}
        };
      }
      break;

    case "cancelDownvote":

      item = update(item, {
        downvoters: {$set: item.downvoters.filter(u => u._id !== user._id)},
        downvotes: {$set: item.upvotes - 1},
        baseScore: {$set: item.baseScore + votePower},
      });
      
      if (!isSimulation) {
        modifier = {
          $pull: {downvoters: user._id},
          $inc: {downvotes: -1, baseScore: votePower}
        };
      }
      break;
  }

  if (!isSimulation) {

    if (context === 'edit') {
      modifier["$set"] = {inactive: false};
      collection.update({_id: item._id}, modifier);
    }
    
    // --------------------- Server-Side Async Callbacks --------------------- //
    runCallbacksAsync(operation+".async", item, user, collection, operation, context); 
  
  }

  const voteResult = item;

  // if (isSimulation) {
  //   console.log('item from apollo store', voteResult);
  // } else {
  //   console.log('item from mongo db', voteResult);
  // }

  return voteResult;
};
