import { Connectors, debug, debugGroup, debugGroupEnd, runCallbacks, runCallbacksAsync } from 'meteor/vulcan:core';
import { createError } from 'apollo-errors';
import Votes from './votes/collection.js';
import Users from 'meteor/vulcan:users';
import { recalculateScore, recalculateBaseScore } from './scoring.js';

/*

Define voting operations

*/
const voteTypes = {}

/*

Add new vote types

*/
export const addVoteType = (voteType, voteTypeOptions) => {
  voteTypes[voteType] = voteTypeOptions;
}

addVoteType('upvote', {power: 1, exclusive: true});
addVoteType('downvote', {power: -1, exclusive: true});

/*

Test if a user has voted on the client

*/
export const hasVotedClient = ({ document, voteType }) => {
  const userVotes = document.currentUserVotes;
  if (voteType) {
    return _.where(userVotes, { voteType }).length
  } else {
    return userVotes && userVotes.length
  }
}

/*

Calculate total power of all a user's votes on a document

*/
const calculateTotalPower = votes => _.pluck(votes, 'power').reduce((a, b) => a + b, 0);

/*

Test if a user has voted on the server

*/
const hasVotedServer = async ({ document, voteType, user }) => {
  const vote = await Connectors.get(Votes, {documentId: document._id, userId: user._id, voteType});
  return vote;
}

/*

Add a vote of a specific type on the client

*/
const addVoteClient = ({ document, collection, voteType, user, voteId }) => {

  const newDocument = {
    ...document,
    baseScore: document.baseScore || 0,
    __typename: collection.options.typeName,
    currentUserVotes: document.currentUserVotes || [],
  };

  // create new vote and add it to currentUserVotes array
  const vote = createVote({ document, collectionName: collection.options.collectionName, voteType, user, voteId });
  newDocument.currentUserVotes = [...newDocument.currentUserVotes, vote];

  // increment baseScore
  newDocument.baseScore += vote.power;
  newDocument.score = recalculateScore(newDocument);

  return newDocument;
}

/*

Add a vote of a specific type on the server

*/
const addVoteServer = async (voteOptions) => {

  const { document, collection, voteType, user, voteId, updateDocument } = voteOptions;
  const newDocument = _.clone(document);

  // create vote and insert it
  const vote = createVote({ document, collectionName: collection.options.collectionName, voteType, user, voteId });
  delete vote.__typename;
  await Connectors.create(Votes, vote);

  // LESSWRONG – recalculateBaseScore
  newDocument.baseScore = recalculateBaseScore(newDocument)
  newDocument.score = recalculateScore(newDocument);

  if (updateDocument) {
    // update document score & set item as active
    await Connectors.update(collection, {_id: document._id}, {$set: {inactive: false, baseScore: newDocument.baseScore, score: newDocument.score}});
  }
  return {newDocument, vote};
}

/*

Cancel votes of a specific type on a given document (client)

*/
const cancelVoteClient = ({ document, voteType }) => {
  const vote = _.findWhere(document.currentUserVotes, { voteType });
  const newDocument = _.clone(document);
  if (vote) {
    // subtract vote scores
    newDocument.baseScore -= vote.power;
    newDocument.score = recalculateScore(newDocument);

    const newVotes = _.reject(document.currentUserVotes, vote => vote.voteType === voteType);

    // clear out vote of this type
    newDocument.currentUserVotes = newVotes;

  }
  return newDocument;
}

/*

Clear *all* votes for a given document and user (client)

*/
const clearVotesClient = ({ document }) => {
  const newDocument = _.clone(document);
  newDocument.baseScore -= calculateTotalPower(document.currentUserVotes);
  newDocument.score = recalculateScore(newDocument);
  newDocument.currentUserVotes = [];
  return newDocument
}

/*

Clear all votes for a given document and user (server)

*/
const clearVotesServer = async ({ document, user, collection, updateDocument }) => {
  const newDocument = _.clone(document);
  const votes = await Connectors.find(Votes, { documentId: document._id, userId: user._id});
  if (votes.length) {
    await Connectors.delete(Votes, {documentId: document._id, userId: user._id});
    votes.forEach((vote)=> {
      runCallbacks(`votes.cancel.sync`, {newDocument, vote}, collection, user);
      runCallbacksAsync(`votes.cancel.async`, {newDocument, vote}, collection, user);
    })
    if (updateDocument) {
      await Connectors.update(collection, {_id: document._id}, {$inc: {baseScore: recalculateBaseScore(document) }});
    }
    newDocument.baseScore = recalculateBaseScore(newDocument);
    newDocument.score = recalculateScore(newDocument);
  }
  return newDocument;
}

/*

Cancel votes of a specific type on a given document (server)

*/
export const cancelVoteServer = async ({ document, voteType, collection, user, updateDocument }) => {

  const newDocument = _.clone(document);
  const vote = Votes.findOne({documentId: document._id, userId: user._id, voteType})
  // remove vote object
  await Connectors.delete(Votes, {_id: vote._id});
  newDocument.baseScore = recalculateBaseScore(newDocument);
  newDocument.score = recalculateScore(newDocument);

  if (updateDocument) {
    // update document score
    await Connectors.update(
      collection,
      {_id: document._id},
      {$set: {
        inactive: false,
        score: newDocument.score,
        baseScore: newDocument.baseScore
      }}
    );
  }
  return {newDocument, vote};
}

/*

Determine a user's voting power for a given operation.
If power is a function, call it on user

*/
const getVotePower = ({ user, voteType, document }) => {
  const power = voteTypes[voteType] && voteTypes[voteType].power || 1;
  return typeof power === 'function' ? power(user, document) : power;
};

/*

Create new vote object

*/
const createVote = ({ document, collectionName, voteType, user, voteId }) => {

  const vote = {
    documentId: document._id,
    collectionName,
    userId: user._id,
    voteType: voteType,
    power: getVotePower({user, voteType, document}),
    votedAt: new Date(),
    __typename: 'Vote'
  }

  // when creating a vote from the server, voteId can sometimes be undefined
  if (voteId) vote._id = voteId;

  return vote;

};

/*

Optimistic response for votes

*/
export const performVoteClient = ({ document, collection, voteType = 'upvote', user, voteId }) => {

  const collectionName = collection.options.collectionName;
  let returnedDocument;

  // console.log('// voteOptimisticResponse')
  // console.log('collectionName: ', collectionName)
  // console.log('document:', document)
  // console.log('voteType:', voteType)

  // make sure item and user are defined
  if (!document || !user || !Users.canDo(user, `${collectionName.toLowerCase()}.${voteType}`)) {
    throw new Error(`Cannot perform operation '${collectionName.toLowerCase()}.${voteType}'`);
  }

  let voteOptions = {document, collection, voteType, user, voteId};

  if (hasVotedClient({document, voteType})) {

    // console.log('action: cancel')
    returnedDocument = cancelVoteClient(voteOptions);
    returnedDocument = runCallbacks(`votes.cancel.client`, returnedDocument, collection, user);

  } else {

    // console.log('action: vote')

    if (voteTypes[voteType].exclusive) {
      const tempDocument = runCallbacks(`votes.clear.client`, voteOptions.document, collection, user);
      voteOptions.document = clearVotesClient({document:tempDocument, collection, voteType, user, voteId})

    }
    returnedDocument = addVoteClient(voteOptions);
    returnedDocument = runCallbacks(`votes.${voteType}.client`, returnedDocument, collection, user, voteType);
  }

  // console.log('returnedDocument:', returnedDocument)

  return returnedDocument;
}

/*

Server-side database operation

### updateDocument
if set to true, this will perform its own database updates. If false, will only
return an updated document without performing any database operations on it.

*/
export const performVoteServer = async ({ documentId, document, voteType = 'bigUpvote', collection, voteId, user, updateDocument = true }) => {

  const collectionName = collection.options.collectionName;
  document = document || await Connectors.get(collection, documentId);

  debug('');
  debugGroup(`--------------- start \x1b[35mperformVoteServer\x1b[0m  ---------------`);
  debug('collectionName: ', collectionName);
  debug('document: ', document);
  debug('voteType: ', voteType);

  const voteOptions = {document, collection, voteType, user, voteId, updateDocument};

  if (!document || !user || !Users.canDo(user, `${collectionName.toLowerCase()}.${voteType}`)) {
    const VoteError = createError('voting.no_permission', {message: 'voting.no_permission'});
    throw new VoteError();
  }

  const existingVote = await hasVotedServer({document, voteType, user});

  if (existingVote) {

    // console.log('action: cancel')

    // runCallbacks(`votes.cancel.sync`, document, collection, user);
    let voteDocTuple = await cancelVoteServer(voteOptions);
    voteDocTuple = await runCallbacks(`votes.cancel.sync`, voteDocTuple, collection, user);
    document = voteDocTuple.newDocument;
    runCallbacksAsync(`votes.cancel.async`, voteDocTuple, collection, user);

  } else {

    // console.log('action: vote')

    if (voteTypes[voteType].exclusive) {
      document = await clearVotesServer(voteOptions)
    }

    let voteDocTuple = await addVoteServer({...voteOptions, document}); //Make sure to pass the new document to addVoteServer
    voteDocTuple = await runCallbacks(`votes.${voteType}.sync`, voteDocTuple, collection, user);
    document = voteDocTuple.newDocument;
    runCallbacksAsync(`votes.${voteType}.async`, voteDocTuple, collection, user);
  }

  debug('document after vote: ', document);
  debugGroupEnd();
  debug(`--------------- end \x1b[35m performVoteServer\x1b[0m ---------------`);
  debug('');

  // const newDocument = collection.findOne(documentId);
  document.__typename = collection.options.typeName;
  return document;

}
