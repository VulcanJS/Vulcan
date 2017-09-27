import { registerSetting, getSetting } from 'meteor/vulcan:core';
import { createError } from 'apollo-errors';
import Votes from './votes/collection.js';
import Users from 'meteor/vulcan:users';

registerSetting('voting.maxVotes', 1, 'How many times a user can vote on the same document');

/*

Define voting operations

*/
export const voteOperations = {
  'upvote': {
    power: 1,
    // TODO: refactor voteOptimisticResponse and performVoteOperation code
    // into extensible, action-specific objects
    // clientOperation: () => {

    // },
    // serverOperation: () => {

    // }
  },
  'downvote': {
    power: -1
  },
  'adminUpvote': {
    power: user => Users.isAdmin(user) ? 5 : 1
  },
  'cancelVote': {

  }
}

/*

Determine a user's voting power for a given operation.
If power is a function, call it on user

*/
export const getVotePower = (user, operationType) => {
  const power = voteOperations[operationType].power;
  return typeof power === 'function' ? power(user) : power;
};

/*

Calculate total power of all a user's votes on a document

*/
export const calculateTotalPower = userVotes => _.pluck(userVotes, 'power').reduce((a, b) => a + b, 0);

/*

Create new vote object

*/
export const createVote = ({ documentId, collectionName, operationType, user, voteId }) => ({
  _id: voteId,
  itemId: documentId,
  collectionName,
  userId: user._id,
  voteType: operationType,
  power: getVotePower(user, operationType),
  votedAt: new Date(),
  __typename: 'Vote'
});

/*

Optimistic response for votes

*/
export const voteOptimisticResponse = ({collection, document, user, operationType = 'upvote', voteId}) => {

  const collectionName = collection.options.collectionName;

  // make sure item and user are defined
  if (!document || !user) {
    throw new Error(`Cannot perform operation '${collectionName}.${operationType}'`);
  }

  // console.log('// voteOptimisticResponse')
  // console.log('collectionName: ', collectionName)
  // console.log('document:', document)
  // console.log('operationType:', operationType)

  // create a "lite" version of the document that only contains relevant fields
  // we do not want to affect the original item directly
  const newDocument = {
    _id: document._id,
    baseScore: document.baseScore || 0,
    __typename: collection.options.typeName,
  };

  if (operationType === 'cancelVote') {

    // subtract vote scores
    newDocument.baseScore -= calculateTotalPower(document.currentUserVotes);

    // clear out all votes
    newDocument.currentUserVotes = [];

  } else {

    // create new vote and add it to currentUserVotes array
    const vote = createVote({ documentId: document._id, collectionName, operationType, user, voteId });
    newDocument.currentUserVotes = [...document.currentUserVotes, vote];

    // increment baseScore
    const power = getVotePower(user, operationType);
    newDocument.baseScore += power;

  }

  return newDocument;  
}

/*

Server-side database operation

*/
export const performVoteOperation = ({documentId, operationType, collection, voteId, currentUser}) => {
  // console.log('// performVoteMutation')
  // console.log('operationType: ', operationType)
  // console.log('collectionName: ', collectionName)
  // console.log('// document: ', collection.findOne(documentId))
  
  const power = getVotePower(currentUser, operationType);
  const userVotes = Votes.find({itemId: documentId, userId: currentUser._id}).fetch();

  if (operationType === 'cancelVote') {
    
    // if a vote has been cancelled, delete all votes and subtract their power from base score
    const scoreTotal = calculateTotalPower(userVotes);

    // remove vote object
    Votes.remove({itemId: documentId, userId: currentUser._id});

    // update document score
    collection.update({_id: documentId}, {$inc: {baseScore: -scoreTotal }});

  } else {

    if (userVotes.length < getSetting('voting.maxVotes')) {

      // create vote and insert it
      const vote = createVote({ documentId, collectionName: collection.options.collectionName, operationType, user: currentUser, voteId });
      delete vote.__typename;
      Votes.insert(vote);

      // update document score
      collection.update({_id: documentId}, {$inc: {baseScore: power }});

    } else {
      const VoteError = createError('voting.maximum_votes_reached', {message: 'voting.maximum_votes_reached'});
      throw new VoteError();
    }

  }
}