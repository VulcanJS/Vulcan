import { GraphQLSchema } from 'meteor/nova:lib';

const specificResolvers = {
  User: {
    __downvotedComments(user, args, context) {
      return user.__downvotedComments ? user.__downvotedComments : []
    },
    __downvotedPosts(user, args, context) {
      return user.__downvotedPosts ? user.__downvotedPosts : []
    },
    __upvotedComments(user, args, context) {
      return user.__upvotedComments ? user.__upvotedComments : []
    },
    __upvotedPosts(user, args, context) {
      console.log('__upvotedPosts resolver')
      return user.__upvotedPosts ? user.__upvotedPosts : [];
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
