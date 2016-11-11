import Telescope from 'meteor/nova:lib';
import mutations from './mutations.js';

const resolvers = {
  
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
      return user.__upvotedPosts ? user.__upvotedPosts : [];
    },
  },

  Query: {
    // this shouldn't be accesssible 😳
    users(root, args, context) {
      const options = {
        limit: 5,
        fields: context.getViewableFields(context.currentUser, Users)
      }
      return context.Users.find({}, {limit: 5}).fetch();
    },
    user(root, args, context) {
      const selector = args._id ? {_id: args._id} : {'__slug': args.slug};
      return context.Users.findOne(selector, { fields: context.getViewableFields(context.currentUser, context.Users) });
    },
    currentUser(root, args, context) {
      return context && context.userId ? context.Users.findOne(context.userId) : null;
    }
  },

  Mutation: mutations,

};

Telescope.graphQL.addResolvers(resolvers);