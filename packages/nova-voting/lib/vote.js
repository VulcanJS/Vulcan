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

Runs all the operation and returns an objects without affecting the db.

*/
export const operateOnItem = function (collection, originalItem, user, operation, isSimulation = false) {

  user = typeof user === "undefined" ? Meteor.user() : user;

  let item = {
    upvotes: 0,
    downvotes: 0,
    upvoters: [],
    downvoters: [],
    baseScore: 0,
    ...originalItem,
  }; // we do not want to affect the original item directly

  const votePower = getVotePower(user);
  const hasUpvotedItem = hasUpvoted(user, item);
  const hasDownvotedItem = hasDownvoted(user, item);
  const modifier = {};

  // console.log('// operateOnItem')
  // console.log('isSimulation: ',isSimulation)
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

  // ------------------------------ Sync Callbacks ------------------------------ //
  
  item = runCallbacks(operation, item, user, operation, isSimulation);

  const voter = isSimulation ? {__typename: "User", _id: user._id} : user._id;
  const filterFunction = isSimulation ? u => u._id !== user._id : u => u !== user._id;

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
      
      break;

    case "cancelUpvote":
      item = update(item, {
        upvoters: {$set: item.upvoters.filter(filterFunction)},
        upvotes: {$set: item.upvotes - 1},
        baseScore: {$set: item.baseScore - votePower},
      });
      break;

    case "cancelDownvote":

      item = update(item, {
        downvoters: {$set: item.downvoters.filter(filterFunction)},
        downvotes: {$set: item.upvotes - 1},
        baseScore: {$set: item.baseScore + votePower},
      });
      
      break;
  }

  // console.log('new item', item);

  return item;
};

/*

Call operateOnItem, update the db with the result, run callbacks.

*/
export const mutateItem = function (collection, originalItem, user, operation) {
  const newItem = operateOnItem(collection, originalItem, user, operation, false);
  newItem.inactive = false;
  collection.update({_id: newItem._id}, newItem, {bypassCollection2:true});

  // --------------------- Server-Side Async Callbacks --------------------- //
  // note: the upvote async callbacks on a "new" context (posts.new, comments.new) are
  // triggered once the insert has been done, see server/callbacks.js
  runCallbacksAsync(operation+".async", newItem, user, collection, operation); 
  
  return newItem;
}
