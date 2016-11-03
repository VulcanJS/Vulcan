import Telescope from 'meteor/nova:lib';
import Users from './collection.js';

// shortcut
const gVF = Users.getViewableFields;

const resolvers = {
  User: {
    telescope(user, args, context) {
      return user.telescope;
    },
  },
  UserTelescope: {
    downvotedComments(telescope, args, context) {
      return telescope.downvotedComments ? telescope.downvotedComments : []
    },
    downvotedPosts(telescope, args, context) {
      return telescope.downvotedPosts ? telescope.downvotedPosts : []
    },
    upvotedComments(telescope, args, context) {
      return telescope.upvotedComments ? telescope.upvotedComments : []
    },
    upvotedPosts(telescope, args, context) {
      return telescope.upvotedPosts ? telescope.upvotedPosts : [];
    },
  },
  Query: {
    users(root, args, context) {
      const options = {
        limit: 5,
        fields: gVF(context.currentUser, Users)
      }
      return context.Users.find({}, {limit: 5}).fetch();
    },
    user(root, args, context) {
      return context.Users.findOne({$or: [{_id: args._id}, {'telescope.slug': args.slug}]}, { fields: gVF(context.currentUser, context.Users) });
    },
    currentUser(root, args, context) {
      return context && context.userId ? context.Users.findOne(context.userId) : null;
    }
  }
};

export default resolvers;