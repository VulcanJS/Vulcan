import { addCallback, addGraphQLSchema, addGraphQLResolvers, addGraphQLMutation, Utils, registerSetting, getSetting } from 'meteor/vulcan:core';
import { voteOnItem } from '../modules/vote.js';
import { VoteableCollections } from '../modules/make_voteable.js';
import { createError } from 'apollo-errors';
import Votes from '../modules/votes/collection.js';


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

addGraphQLMutation('vote(documentId: String, operationType: String, collectionName: String) : Voteable');

const voteResolver = {
  Mutation: {
    async vote(root, {documentId, operationType, collectionName}, context) {
      
      const { currentUser } = context;
      const collection = context[Utils.capitalize(collectionName)];

      // query for document being voted on
      const document = await collection.queryOne(documentId, {
        fragmentText: `
          fragment DocumentVoteFragment on ${collection.typeName} {
              __typename
              _id
              currentUserVotes{
                _id
                voteType
                power
              }
              baseScore
            }  
        `,
        context
      });

      if (context.Users.canDo(currentUser, `${collectionName.toLowerCase()}.${operationType}`)) {

        // put document through voteOnItem and get result
        const voteResult = voteOnItem(collection, document, currentUser, operationType);
        
        // get new version of document
        const newDocument = voteResult.document;
        newDocument.__typename = collection.typeName;

        // get created or cancelled vote
        const vote = voteResult.vote;

        if (operationType === 'cancelVote' && vote) {
          // if a vote has been cancelled, delete it
          Votes.remove(vote._id);
        } else {
          // if a vote has been created, insert it
          delete vote.__typename;
          Votes.insert(vote);
        }

        // in any case, return the document that was voted on
        return newDocument;

      } else {
        
        const VoteError = createError('cannot_vote');
        throw new VoteError();
      
      }
    },
  },
};

addGraphQLResolvers(voteResolver);
