import SimpleSchema from 'simpl-schema';

import Users from "meteor/vulcan:users";
import Posts from "meteor/vulcan:posts";
import Comments from "meteor/vulcan:comments";

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

Posts.addField([
  /**
    How many upvotes the post has received
  */
  {
    fieldName: "upvotes",
    fieldSchema: {
      type: Number,
      optional: true,
      defaultValue: 0,
      viewableBy: ['guests'],
    }
  },
  /**
    An array containing the `_id`s of the post's upvoters
  */
  {
    fieldName: "upvoters",
    fieldSchema: {
      type: Array,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: {
        fieldName: 'upvoters',
        type: '[User]',
        resolver: async (post, args, {currentUser, Users}) => {
          if (!post.upvoters) return [];
          const upvoters = await Users.loader.loadMany(post.upvoters);
          return Users.restrictViewableFields(currentUser, Users, upvoters);
        },
      },
    }
  },
  {
    fieldName: "upvoters.$",
    fieldSchema: {
      type: String,
      optional: true
    }
  },
  /**
    How many downvotes the post has received
  */
  {
    fieldName: "downvotes",
    fieldSchema: {
      type: Number,
      optional: true,
      defaultValue: 0,
      viewableBy: ['guests'],
    }
  },
  /**
    An array containing the `_id`s of the post's downvoters
  */
  {
    fieldName: "downvoters",
    fieldSchema: {
      type: Array,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: {
        fieldName: 'downvoters',
        type: '[User]',
        resolver: async (post, args, {currentUser, Users}) => {
          if (!post.downvoters) return [];
          const downvoters = await Users.loader.loadMany(post.downvoters);
          return Users.restrictViewableFields(currentUser, Users, downvoters);
        },
      },
    }
  },
  {
    fieldName: "downvoters.$",
    fieldSchema: {
      type: String,
      optional: true,
    }
  },
  /**
    The post's base score (not factoring in the post's age)
  */
  {
    fieldName: "baseScore",
    fieldSchema: {
      type: Number,
      optional: true,
      defaultValue: 0,
      viewableBy: ['guests'],
    }
  },
  /**
    The post's current score (factoring in age)
  */
  {
    fieldName: "score",
    fieldSchema: {
      type: Number,
      optional: true,
      defaultValue: 0,
      viewableBy: ['guests'],
    }
  },
]);

Comments.addField([
  /**
    The number of upvotes the comment has received
  */
  {
    fieldName: "upvotes",
    fieldSchema: {
      type: Number,
      optional: true,
      defaultValue: 0,
      viewableBy: ['guests'],
    }
  },
  /**
    An array containing the `_id`s of upvoters
  */
  {
    fieldName: "upvoters",
    fieldSchema: {
      type: Array,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: {
        fieldName: 'upvoters',
        type: '[User]',
        resolver: async (comment, args, {currentUser, Users}) => {
          if (!comment.upvoters) return [];
          const upvoters = await Users.loader.loadMany(comment.upvoters);
          return Users.restrictViewableFields(currentUser, Users, upvoters);
        },
      },
    }
  },
  {
    fieldName: "upvoters.$",
    fieldSchema: {
      type: String,
      optional: true
    }
  },
  /**
    The number of downvotes the comment has received
  */
  {
    fieldName: "downvotes",
    fieldSchema: {
      type: Number,
      optional: true,
      defaultValue: 0,
      viewableBy: ['guests'],
    }
  },
  /**
    An array containing the `_id`s of downvoters
  */
  {
    fieldName: "downvoters",
    fieldSchema: {
      type: Array,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: {
        fieldName:'downvoters',
        type: '[User]',
        resolver: async (comment, args, {currentUser, Users}) => {
          if (!comment.downvoters) return [];
          const downvoters = await Users.loader.loadMany(comment.downvoters);
          return Users.restrictViewableFields(currentUser, Users, downvoters);
        },
      },
    }
  },
  {
    fieldName: "downvoters.$",
    fieldSchema: {
      type: String,
      optional: true,
    }
  },
  /**
    The comment's base score (not factoring in the comment's age)
  */
  {
    fieldName: "baseScore",
    fieldSchema: {
      type: Number,
      optional: true,
      defaultValue: 0,
      viewableBy: ['guests'],
    }
  },
  /**
    The comment's current score (factoring in age)
  */
  {
    fieldName: "score",
    fieldSchema: {
      type: Number,
      optional: true,
      defaultValue: 0,
      viewableBy: ['guests'],
    }
  },
]);

