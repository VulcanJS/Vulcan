import { GraphQLSchema } from 'meteor/nova:lib';

const specificResolvers = {
  User: {
    downvotedComments(user, args, context) {
      return user.downvotedComments ? user.downvotedComments : []
    },
    downvotedPosts(user, args, context) {
      return user.downvotedPosts ? user.downvotedPosts : []
    },
    upvotedComments(user, args, context) {
      return user.upvotedComments ? user.upvotedComments : []
    },
    upvotedPosts(user, args, context) {
      return user.upvotedPosts ? user.upvotedPosts : [];
    },
  },
  Post: {
    upvoters(post, args, context) {
      return post.upvoters ? context.Users.find({_id: {$in: post.upvoters}}, { fields: context.getViewableFields(context.currentUser, context.Users) }).fetch() : [];
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
