import Telescope from 'meteor/nova:lib';
import Comments from './collection.js';
import Users from 'meteor/nova:users';


// check if user can create a new comment
const canInsert = user => Users.canDo(user, "comments.new");

// check if user can edit a comment
const canEdit = Users.canEdit;

// check if user can edit *all* comments
const canEditAll = user => Users.canDo(user, "comments.edit.all");

const alwaysPublic = user => true;

/**
 * @summary Comments schema
 * @type {SimpleSchema}
 */
Comments.schema = new SimpleSchema({
  /**
    ID
  */
  _id: {
    type: String,
    optional: true,
    publish: true,
    viewableIf: alwaysPublic,
  },
  /**
    The `_id` of the parent comment, if there is one
  */
  parentCommentId: {
    type: String,
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    viewableIf: alwaysPublic,
    insertableIf: canInsert,
    optional: true,
    publish: true,
    resolveAs: 'parentComment: Comment',
    control: "none" // never show this
  },
  /**
    The `_id` of the top-level parent comment, if there is one
  */
  topLevelCommentId: {
    type: String,
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    viewableIf: alwaysPublic,
    insertableIf: canInsert,
    optional: true,
    publish: true,
    resolveAs: 'topLevelComment: Comment',
    control: "none" // never show this
  },
  /**
    The timestamp of comment creation
  */
  createdAt: {
    type: Date,
    optional: true,
    publish: false,
    viewableIf: canEditAll,
  },
  /**
    The timestamp of the comment being posted. For now, comments are always created and posted at the same time
  */
  postedAt: {
    type: Date,
    optional: true,
    publish: true,
    viewableIf: alwaysPublic,
  },
  /**
    The comment body (Markdown)
  */
  body: {
    type: String,
    max: 3000,
    viewableIf: alwaysPublic,
    insertableIf: canInsert,
    editableIf: canEdit,
    publish: true,
    control: "textarea"
  },
  /**
    The HTML version of the comment body
  */
  htmlBody: {
    type: String,
    optional: true,
    publish: true,
    viewableIf: alwaysPublic,
  },
  /**
    The comment author's name
  */
  author: {
    type: String,
    optional: true,
    publish: true,
    viewableIf: alwaysPublic,
  },
  /**
    Whether the comment is inactive. Inactive comments' scores gets recalculated less often
  */
  inactive: {
    type: Boolean,
    optional: true,
    publish: true,
    viewableIf: alwaysPublic,
  },
  /**
    The post's `_id`
  */
  postId: {
    type: String,
    optional: true,
    publish: true,
    viewableIf: alwaysPublic,
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    resolveAs: 'post: Post',
    form: {
      omit: true // never show this
    }
  },
  /**
    The comment author's `_id`
  */
  userId: {
    type: String,
    optional: true,
    publish: true,
    viewableIf: alwaysPublic,
    join: {
      joinAs: "user",
      collection: () => Users
    },
    resolveAs: 'user: User',
  },
  /**
    Whether the comment is deleted. Delete comments' content doesn't appear on the site. 
  */
  isDeleted: {
    type: Boolean,
    optional: true,
    publish: true,
    viewableIf: alwaysPublic,
  },
  userIP: {
    type: String,
    optional: true,
    publish: false,
    viewableIf: canEditAll,
  },
  userAgent: {
    type: String,
    optional: true,
    publish: false,
    viewableIf: canEditAll,
  },
  referrer: {
    type: String,
    optional: true,
    publish: false,
    viewableIf: canEditAll,
  }
});

Comments.attachSchema(Comments.schema);

if (typeof Telescope.notifications !== "undefined") {
  Comments.addField({
    fieldName: 'disableNotifications',
    fieldSchema: {
      type: Boolean,
      optional: true,
      form: {
        omit: true
      }
    }
  });
}

// Comments.graphQLSchema = `
//   type Comment {
//     _id: String
//     parentComment: Comment
//     topLevelComment: Comment
//     createdAt: String
//     postedAt: String
//     body: String
//     htmlBody: String
//     author: String
//     inactive: Boolean
//     post: Post
//     user: User
//     isDeleted: Boolean
//     isDummy: Boolean
//     upvotes: Int
//     upvoters: [User]
//     downvotes: Int
//     downvoters: [User]
//     baseScore: Int
//     score: Float
//     parentCommentId: String
//     topLevelCommentId: String
//     postId: String
//   }

//   input commentsInput {
//     parentCommentId: String
//     topLevelCommentId: String
//     postId: String
//     body: String!
//   }

//   input commentsUnset {
//     parentCommentId: Boolean
//     topLevelCommentId: Boolean
//     postId: Boolean
//     body: Boolean 
//   }
// `;

// add Comments collection to list to auto-generate its GraphQL schema
Telescope.graphQL.addCollection(Comments, 'Comment');

Telescope.graphQL.addToContext({ Comments });
