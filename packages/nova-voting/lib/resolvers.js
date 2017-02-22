import { GraphQLSchema } from 'meteor/nova:core';

const specificResolvers = {
  Post: {
    async upvoters(post, args, context) {
      try {
        if (post.upvoters) {
          const voters = await context.BatchingUsers.find({_id: {$in: post.upvoters}}, { fields: context.getViewableFields(context.currentUser, context.Users) });
          
          return voters;
        }
        
        return [];
      } catch(error) {
        throw Error(error);
      }
    },
    async downvoters(post, args, context) {
      try {
        if (post.downvoters) {
          const voters = await context.BatchingUsers.find({_id: {$in: post.downvoters}}, { fields: context.getViewableFields(context.currentUser, context.Users) });
          
          return voters;
        }
        
        return [];
      } catch(error) {
        throw Error(error);
      }
    },
  },
  Comment: {
    async upvoters(comment, args, context) {
      try {
        if (comment.upvoters) {
          const voters = await context.BatchingUsers.find({_id: {$in: comment.upvoters}}, { fields: context.getViewableFields(context.currentUser, context.Users) });
          
          return voters;
        }
        
        return [];
      } catch(error) {
        throw Error(error);
      }
    },
    async downvoters(comment, args, context) {
      try {
        if (comment.downvoters) {
          const voters = await context.BatchingUsers.find({_id: {$in: comment.downvoters}}, { fields: context.getViewableFields(context.currentUser, context.Users) });
          
          return voters;
        }
        
        return [];
      } catch(error) {
        throw Error(error);
      }
    },
  },
};

GraphQLSchema.addResolvers(specificResolvers);
