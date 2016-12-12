import Telescope from 'meteor/nova:lib';
import Posts from 'meteor/nova:posts';
import { GraphQLSchema } from 'meteor/nova:core';
import { operateOnItem } from './vote.js';
/**
 * @summary Vote schema
 * @type {SimpleSchema}
 */
Telescope.schemas.votes = new SimpleSchema({
  itemId: {
    type: String
  },
  power: {
    type: Number,
    optional: true
  },
  votedAt: {
    type: Date, 
    optional: true
  }
});

const voteSchema = `
  type Vote {
    itemId: String
    power: Float
    votedAt: String
  }
`;

GraphQLSchema.addSchema(voteSchema);

GraphQLSchema.addMutation('postsVote(documentId: String, voteType: String) : Post');

const voteResolver = {
  Mutation: {
    postsVote(root, {documentId, voteType}, context) {
      Meteor._sleepForMs(2000); // wait 2 seconds for demonstration purpose
      console.log("sleep done");
      const post = Posts.findOne(documentId);
      return context.Users.canDo(context.currentUser, `posts.${voteType}`) ? operateOnItem(context.Posts, post, context.currentUser, voteType) : false;
    },
  },
};

GraphQLSchema.addResolvers(voteResolver);