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
    fieldName: 'upvotedComments',
    fieldSchema: {
      type: [voteSchema],
      publish: false,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: 'upvotedComments: [Vote]',
    }
  },
  /**
    An array containing posts upvotes
  */
  {
    fieldName: 'upvotedPosts',
    fieldSchema: {
      type: [voteSchema],
      publish: false,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: 'upvotedPosts: [Vote]',
    }
  },
  /**
    An array containing comment downvotes
  */
  {
    fieldName: 'downvotedComments',
    fieldSchema: {
      type: [voteSchema],
      publish: false,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: 'downvotedComments: [Vote]',
    }
  },
  /**
    An array containing posts downvotes
  */
  {  
    fieldName: 'downvotedPosts',
    fieldSchema: {
      type: [voteSchema],
      publish: false,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: 'downvotedPosts: [Vote]',
    }
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
      type: [String],
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
      type: [String],
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
      decimal: true,
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
      decimal: true,
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
      type: [String],
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
      type: [String],
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
      decimal: true,
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
      decimal: true,
      optional: true,
      publish: true,
      defaultValue: 0,
      viewableBy: ['guests'],
    }
  },
]);

