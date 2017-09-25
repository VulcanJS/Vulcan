import Users from 'meteor/vulcan:users';
import { hasUpvoted, hasDownvoted } from './helpers.js';
import { runCallbacks, runCallbacksAsync, registerSetting, getSetting } from 'meteor/vulcan:core';
import update from 'immutability-helper';
import Votes from './votes/collection.js';

registerSetting('voting.maxVotes', 1, 'How many times a user can vote on the same document');

// The equation to determine voting power. Defaults to returning 1 for everybody
export const getVotePower = (user, operationType) => {
  return operationType === 'upvote' ? 1 : -1;
};

const keepVoteProperties = item => _.pick(item, '__typename', '_id', 'upvoters', 'downvoters', 'upvotes', 'downvotes', 'baseScore');

/*

Runs all the operation and returns an objects without affecting the db.

*/
export const voteOnItem = function (collection, document, user, operationType = 'upvote') {

  const collectionName = collection.options.collectionName;
  let result = {};

  // make sure item and user are defined
  if (!document || !user) {
    throw new Error(`Cannot perform operation '${collectionName}.${operationType}'`);
  }

  /*

  First, handle vote cancellation.
  Just remove last vote and subtract its power from the base score

  */
  if (operationType === 'cancelVote') {

     // create a "lite" version of the document that only contains relevant fields
    const newDocument = {
      _id: document._id,
      currentUserVotes: document.currentUserVotes || [],
      // voters: document.voters || [],
      baseScore: document.baseScore || 0,
      __typename: collection.options.typeName,
    }; // we do not want to affect the original item directly

    // if document has votes
    if (newDocument.currentUserVotes.length) {
      // remove one vote
      const cancelledVote = _.last(newDocument.currentUserVotes);
      newDocument.currentUserVotes = _.initial(newDocument.currentUserVotes);
      result.vote = cancelledVote;

      // update base score
      newDocument.baseScore -= cancelledVote.power;
    }

    // console.log('// voteOnItem')
    // console.log('collection: ', collectionName)
    // console.log('document:', document)
    // console.log('newDocument:', newDocument)

    result.document = newDocument;

  } else {
  /*

  Next, handle all other vote types (upvote, downvote, etc.)
  
  */

    const power = getVotePower(user, operationType);

    // create vote object
    const vote = {
      _id: Random.id(),
      itemId: document._id,
      collectionName,
      userId: user._id,
      voteType: operationType,
      power,
      votedAt: new Date(),
      __typename: 'Vote'
    };

    // create a "lite" version of the document that only contains relevant fields
    const currentUserVotes = document.currentUserVotes || [];
    const newDocument = {
      _id: document._id,
      currentUserVotes: [...currentUserVotes, vote],
      // voters: document.voters || [],
      baseScore: document.baseScore || 0,
      __typename: collection.options.typeName,
    }; // we do not want to affect the original item directly

    // update score
    newDocument.baseScore += power;

    // console.log('// voteOnItem')
    // console.log('collection: ', collectionName)
    // console.log('document:', document)
    // console.log('newDocument:', newDocument)

    // make sure item and user are defined, and user can perform the operation
    if (newDocument.currentUserVotes.length > getSetting('voting.maxVotes')) {
      throw new Error(`Cannot perform operation '${collectionName}.${operationType}'`);
    }

    // ------------------------------ Sync Callbacks ------------------------------ //

    // item = runCallbacks(operation, item, user, operation, isClient);

    result = {
      document: newDocument,
      vote
    };
  }

  return result;

};

export const cancelVote = function (collection, document, user, voteType = 'vote') {

};

/*

Call operateOnItem, update the db with the result, run callbacks.

*/
// export const mutateItem = function (collection, originalItem, user, operation) {
//   const newItem = operateOnItem(collection, originalItem, user, operation, false);
//   newItem.inactive = false;

//   collection.update({_id: newItem._id}, newItem, {bypassCollection2:true});

//   // --------------------- Server-Side Async Callbacks --------------------- //
//   runCallbacksAsync(operation+'.async', newItem, user, collection, operation);

//   return newItem;
// }
