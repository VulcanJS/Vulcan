import { addCallback, addGraphQLSchema, addGraphQLResolvers, addGraphQLMutation, Utils } from 'meteor/vulcan:core';
import { mutateItem } from '../modules/vote.js';
import { VoteableCollections } from '../modules/make_voteable.js';
import { createError } from 'apollo-errors';

function CreateVoteableUnionType() {
  const voteSchema = `
    type Vote {
      itemId: String
      power: Float
      votedAt: String
    }
    
    union Voteable = ${VoteableCollections.map(collection => collection.typeName).join(' | ')}
  `;

  addGraphQLSchema(voteSchema);
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

addGraphQLMutation('vote(documentId: String, voteType: String, collectionName: String) : Voteable');

const voteResolver = {
  Mutation: {
    vote(root, {documentId, voteType, collectionName}, context) {
      
      const collection = context[Utils.capitalize(collectionName)];
      const document = collection.findOne(documentId);
      
      if (context.Users.canDo(context.currentUser, `${collectionName.toLowerCase()}.${voteType}`)) {
        
        const mutatedDocument = mutateItem(collection, document, context.currentUser, voteType, false);
        mutatedDocument.__typename = collection.typeName;
        return mutatedDocument;

      } else {
        
        const VoteError = createError('cannot_vote');
        throw new VoteError();
      
      }
    },
  },
};

addGraphQLResolvers(voteResolver);
