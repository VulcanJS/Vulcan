import SimpleSchema from 'simpl-schema';

import Users from "meteor/vulcan:users";
/**
 * @summary Vote schema
 * @type {SimpleSchema}
 */
const voteSchema = new SimpleSchema({
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

Users.addField([
  /**
    An array containing comments upvotes
  */
  {
    fieldName: 'upvotedComments',
    fieldSchema: {
      type: Array,
      optional: true,
      viewableBy: Users.owns,
      resolveAs: {
        fieldName: 'upvotedComments',
        type: '[Vote]',
        resolver: async (user, args, {currentUser, Users, Comments}) => {
          if (!user.upvotedComments) return [];
          const comments = await Comments.loader.loadMany(user.upvotedComments);
          return Users.restrictViewableFields(currentUser, Comments, comments);
        }
      },
    }
  },
  {
    fieldName: 'upvotedComments.$',
    fieldSchema: {
      type: voteSchema,
      optional: true
    }
  },
  /**
    An array containing posts upvotes
  */
  {
    fieldName: 'upvotedPosts',
    fieldSchema: {
      type: Array,
      optional: true,
      viewableBy: Users.owns,
      resolveAs: {
        fieldName: 'upvotedPosts',
        type: '[Vote]',
        resolver: async (user, args, {currentUser, Users, Posts}) => {
          if (!user.upvotedPosts) return [];
          const posts = await Posts.loader.loadMany(user.upvotedPosts);
          return Users.restrictViewableFields(currentUser, Posts, posts);
        }
      },
    }
  },
  {
    fieldName: 'upvotedPosts.$',
    fieldSchema: {
      type: voteSchema,
      optional: true
    }
  },
  /**
    An array containing comment downvotes
  */
  {
    fieldName: 'downvotedComments',
    fieldSchema: {
      type: Array,
      optional: true,
      viewableBy: Users.owns,
      resolveAs: {
        fieldName: 'downvotedComments',
        type: '[Vote]',
        resolver: async (user, args, {currentUser, Users, Comments}) => {
          if (!user.downvotedComments) return [];
          const comments = await Comments.loader.loadMany(user.downvotedComments);
          return Users.restrictViewableFields(currentUser, Comments, comments);
        }
      },
    }
  },
  {
    fieldName: 'downvotedComments.$',
    fieldSchema: {
      type: voteSchema,
      optional: true
    }
  },
  /**
    An array containing posts downvotes
  */
  {
    fieldName: 'downvotedPosts',
    fieldSchema: {
      type: Array,
      optional: true,
      viewableBy: Users.owns,
      resolveAs: {
        fieldName: 'downvotedPosts',
        type: '[Vote]',
        resolver: async (user, args, {currentUser, Users, Posts}) => {
          if (!user.downvotedPosts) return [];
          const posts = await Posts.loader.loadMany(user.downvotedPosts);
          return Users.restrictViewableFields(currentUser, Posts, posts);
        }
      },
    }
  },
  {
    fieldName: 'downvotedPosts.$',
    fieldSchema: {
      type: voteSchema,
      optional: true
    }
  }
]);


