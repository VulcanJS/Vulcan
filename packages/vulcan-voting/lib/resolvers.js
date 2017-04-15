import { GraphQLSchema } from 'meteor/vulcan:core';

const specificResolvers = {
  Post: {
    async upvoters(post, args, context) {
      console.log("// Post.upvoters: ", new Date().getMilliseconds())
      const upvoters = post.upvoters ? await context.Users.loader.loadMany(post.upvoters, `Post.upvoters (${post.title})`) : [];
      return context.Users.restrictViewableFields(context.currentUser, context.Users, upvoters);
    },
    downvoters(post, args, context) {
      return post.downvoters ? context.Users.find({_id: {$in: post.downvoters}}, { fields: context.getViewableFields(context.currentUser, context.Users) }).fetch() : [];
    },
  },
  Comment: {
    upvoters(comment, args, context) {
      return comment.upvoters ? context.Users.find({_id: {$in: comment.upvoters}}, { fields: context.getViewableFields(context.currentUser, context.Users) }).fetch() : [];
    },
    downvoters(comment, args, context) {
      return comment.downvoters ? context.Users.find({_id: {$in: comment.downvoters}}, { fields: context.getViewableFields(context.currentUser, context.Users) }).fetch() : [];
    },
  },
};

GraphQLSchema.addResolvers(specificResolvers);
