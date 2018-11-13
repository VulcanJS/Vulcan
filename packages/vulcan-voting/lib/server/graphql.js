import { addCallback, addGraphQLSchema, addGraphQLResolvers, addGraphQLMutation } from 'meteor/vulcan:core';
import { performVoteServer } from '../modules/vote.js';
import { VoteableCollections } from '../modules/make_voteable.js';

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

addGraphQLMutation('vote(documentId: String, voteType: String, collectionName: String, voteId: String) : Voteable');

const voteResolver = {
  Mutation: {
    async vote(root, {documentId, voteType, collectionName, voteId}, context) {
      
      const { currentUser } = context;
      const collection = context[collectionName];

      const document = await performVoteServer({documentId, voteType, collection, voteId, user: currentUser});
      return document;

    },
  },
};

addGraphQLResolvers(voteResolver);
