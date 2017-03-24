import Users from 'meteor/vulcan:users';
import { hasUpvoted, hasDownvoted } from './helpers.js';
import { runCallbacks, runCallbacksAsync } from 'meteor/vulcan:core';
import update from 'immutability-helper';

// The equation to determine voting power. Defaults to returning 1 for everybody
export const getVotePower = function (user) {
  return 1;
};

const keepVoteProperties = item => _.pick(item, '__typename', '_id', 'upvoters', 'downvoters', 'upvotes', 'downvotes', 'baseScore');

/*

Runs all the operation and returns an objects without affecting the db.

*/
export const operateOnItem = function (collection, originalItem, user, operation, isClient = false) {

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
  const collectionName = collection._name;
  const canDo = Users.canDo(user, `${collectionName}.${operation}`);

  // console.log('// operateOnItem')
  // console.log('isClient: ', isClient)
  // console.log('collection: ', collectionName)
  // console.log('operation: ', operation)
  // console.log('item: ', item)
  // console.log('user: ', user)
  // console.log('hasUpvotedItem: ', hasUpvotedItem)
  // console.log('hasDownvotedItem: ', hasDownvotedItem)
  // console.log('canDo: ', canDo)

  // make sure item and user are defined, and user can perform the operation
  if (
    !item ||
    !user ||
    !canDo ||
    operation === "upvote" && hasUpvotedItem ||
    operation === "downvote" && hasDownvotedItem ||
    operation === "cancelUpvote" && !hasUpvotedItem ||
    operation === "cancelDownvote" && !hasDownvotedItem
  ) {
    throw new Error(`Cannot perform operation "${collectionName}.${operation}"`);
  }

  // ------------------------------ Sync Callbacks ------------------------------ //

  item = runCallbacks(operation, item, user, operation, isClient);

  /*

  voters arrays have different structures on client and server:

  - client: [{__typename: "User", _id: 'foo123'}]
  - server: ['foo123']

  */

  const voter = isClient ? {__typename: "User", _id: user._id} : user._id;
  const filterFunction = isClient ? u => u._id !== user._id : u => u !== user._id;

  switch (operation) {

    case "upvote":
      if (hasDownvotedItem) {
        item = operateOnItem(collection, item, user, "cancelDownvote", isClient);
      }

      item = update(item, {
        upvoters: {$push: [voter]},
        upvotes: {$set: item.upvotes + 1},
        baseScore: {$set: item.baseScore + votePower},
      });

      break;

    case "downvote":
      if (hasUpvotedItem) {
        item = operateOnItem(collection, item, user, "cancelUpvote", isClient);
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
        downvotes: {$set: item.downvotes - 1},
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
  runCallbacksAsync(operation+".async", newItem, user, collection, operation);

  return newItem;
}
