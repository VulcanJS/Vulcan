import Telescope from 'meteor/nova:lib';
import mutations from './mutations.js';

const resolvers = {
  
  User: {
    nova_downvotedComments(user, args, context) {
      return user.nova_downvotedComments ? user.nova_downvotedComments : []
    },
    nova_downvotedPosts(user, args, context) {
      return user.nova_downvotedPosts ? user.nova_downvotedPosts : []
    },
    nova_upvotedComments(user, args, context) {
      return user.nova_upvotedComments ? user.nova_upvotedComments : []
    },
    nova_upvotedPosts(user, args, context) {
      return user.nova_upvotedPosts ? user.nova_upvotedPosts : [];
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
      return context.Users.findOne({$or: [{_id: args._id}, {'nova_slug': args.slug}]}, { fields: context.getViewableFields(context.currentUser, context.Users) });
    },
    currentUser(root, args, context) {
      return context && context.userId ? context.Users.findOne(context.userId) : null;
    }
  },

  Mutation: mutations,

};

Telescope.graphQL.addResolvers(resolvers);