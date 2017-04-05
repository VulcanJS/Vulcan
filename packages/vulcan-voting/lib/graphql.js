import { GraphQLSchema, Utils } from 'meteor/vulcan:core';
import { mutateItem } from './vote.js';

const voteSchema = `
  type Vote {
    itemId: String
    power: Float
    votedAt: String
  }
  
  union Votable = Post | Comment
`;

GraphQLSchema.addSchema(voteSchema);

const resolverMap = {
  Votable: {
    __resolveType(obj, context, info){
      if(obj.title){
        return 'Post';
      }

      if(obj.postId){
        return 'Comment';
      }

      return null;
    },
  },
};

GraphQLSchema.addResolvers(resolverMap);

GraphQLSchema.addMutation('vote(documentId: String, voteType: String, collectionName: String) : Votable');

const voteResolver = {
  Mutation: {
    vote(root, {documentId, voteType, collectionName}, context) {
      const collection = context[Utils.capitalize(collectionName)];
      const document = collection.findOne(documentId);
      return context.Users.canDo(context.currentUser, `${collectionName.toLowerCase()}.${voteType}`) ? mutateItem(collection, document, context.currentUser, voteType, false) : false;
    },
  },
};

GraphQLSchema.addResolvers(voteResolver);
