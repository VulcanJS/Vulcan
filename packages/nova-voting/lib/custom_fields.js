import SimpleSchema from 'simpl-schema';
import Users from "meteor/nova:users";
import Posts from "meteor/nova:posts";
import Comments from "meteor/nova:comments";

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
    fieldName: '__upvotedComments',
    fieldSchema: {
      type: Array,
      publish: false,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: '__upvotedComments: [Vote]',
    }
  },
  {
    fieldName: '__upvotedComments.$',
    fieldSchema: voteSchema,
  },
  /**
    An array containing posts upvotes
  */
  {
    fieldName: '__upvotedPosts',
    fieldSchema: {
      type: Array,
      publish: false,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: '__upvotedPosts: [Vote]',
    }
  },
  {
    fieldName: '__upvotedPosts.$',
    fieldSchema: voteSchema,
  },
  /**
    An array containing comment downvotes
  */
  {
    fieldName: '__downvotedComments',
    fieldSchema: {
      type: Array,
      publish: false,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: '__downvotedComments: [Vote]',
    }
  },
  {
    fieldName: '__downvotedComments.$',
    fieldSchema: voteSchema,
  },
  /**
    An array containing posts downvotes
  */
  {  
    fieldName: '__downvotedPosts',
    fieldSchema: {
      type: Array,
      publish: false,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: '__downvotedPosts: [Vote]',
    }
  },
  {
    fieldName: '__downvotedPosts.$',
    fieldSchema: voteSchema,
  },
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
      publish: true,
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
      publish: true,
      viewableBy: ['guests'],
      resolveAs: 'upvoters: [User]',
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
      publish: true,
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
      publish: true,
      viewableBy: ['guests'],
      resolveAs: 'downvoters: [User]',
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
      publish: true,
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
      publish: true,
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
      publish: true,
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
      publish: true,
      viewableBy: ['guests'],
      resolveAs: 'upvoters: [User]',
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
      publish: true,
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
      publish: true,
      viewableBy: ['guests'],
      resolveAs: 'downvoters: [User]',
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
      publish: true,
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
      publish: true,
      defaultValue: 0,
      viewableBy: ['guests'],
    }
  },
]);
