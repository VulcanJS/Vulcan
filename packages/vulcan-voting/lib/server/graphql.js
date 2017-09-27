import { addCallback, addGraphQLSchema, addGraphQLResolvers, addGraphQLMutation, Utils, registerSetting, getSetting } from 'meteor/vulcan:core';
import { performVoteOperation } from '../modules/vote.js';
import { VoteableCollections } from '../modules/make_voteable.js';
import { createError } from 'apollo-errors';

function CreateVoteableUnionType() {
  const voteableSchema = VoteableCollections.length ? `union Voteable = ${VoteableCollections.map(collection => collection.typeName).join(' | ')}` : '';
  addGraphQLSchema(voteableSchema);
  return {}
}
addCallback('graphql.init.before', CreateVoteableUnionType);

const resolverMap = {
  Voteable: {
    __resolveType(obj, context, info){
      return obj.__typename;
    },
  },
};

addGraphQLResolvers(resolverMap);

addGraphQLMutation('vote(documentId: String, operationType: String, collectionName: String, voteId: String) : Voteable');

const voteResolver = {
  Mutation: {
    async vote(root, {documentId, operationType, collectionName, voteId}, context) {
      
      const { currentUser } = context;
      const collection = context[collectionName];
  
      if (context.Users.canDo(currentUser, `${collectionName.toLowerCase()}.${operationType}`)) {

        performVoteOperation({documentId, operationType, collection, voteId, currentUser});

        const document = collection.findOne(documentId);
        document.__typename = collection.options.typeName;
        return document;

      } else {
        
        const VoteError = createError('voting.cannot_vote', {message: 'voting.cannot_vote'});
        throw new VoteError();
      
      }
    },
  },
};

addGraphQLResolvers(voteResolver);
