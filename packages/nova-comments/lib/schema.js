import Comments from './collection.js';
import Users from 'meteor/nova:users';

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
  },
  /**
    The `_id` of the parent comment, if there is one
  */
  parentCommentId: {
    type: String,
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    insertableIf: Users.is.memberOrAdmin,
    optional: true,
    publish: true,
    control: "none" // never show this
  },
  /**
    The `_id` of the top-level parent comment, if there is one
  */
  topLevelCommentId: {
    type: String,
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    insertableIf: Users.is.memberOrAdmin,
    optional: true,
    publish: true,
    control: "none" // never show this
  },
  /**
    The timestamp of comment creation
  */
  createdAt: {
    type: Date,
    optional: true,
    publish: false
  },
  /**
    The timestamp of the comment being posted. For now, comments are always created and posted at the same time
  */
  postedAt: {
    type: Date,
    optional: true,
    publish: true,
  },
  /**
    The comment body (Markdown)
  */
  body: {
    type: String,
    max: 3000,
    insertableIf: Users.is.memberOrAdmin,
    editableIf: Users.is.ownerOrAdmin,
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
  },
  /**
    The comment author's name
  */
  author: {
    type: String,
    optional: true,
    publish: true,
  },
  /**
    Whether the comment is inactive. Inactive comments' scores gets recalculated less often
  */
  inactive: {
    type: Boolean,
    optional: true,
    publish: true,
  },
  /**
    The post's `_id`
  */
  postId: {
    type: String,
    optional: true,
    publish: true,
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    // editableIf: Users.is.ownerOrAdmin, // TODO: should users be able to set postId, but not modify it?
    autoform: {
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
    join: {
      joinAs: "user",
      collection: () => Meteor.users
    }
  },
  /**
    Whether the comment is deleted. Delete comments' content doesn't appear on the site. 
  */
  isDeleted: {
    type: Boolean,
    optional: true,
    publish: true,
  },
  userIP: {
    type: String,
    optional: true,
    publish: false
  },
  userAgent: {
    type: String,
    optional: true,
    publish: false
  },
  referrer: {
    type: String,
    optional: true,
    publish: false
  }
});

Comments.attachSchema(Comments.schema);

if (typeof Telescope.notifications !== "undefined") {
  Comments.addField({
    fieldName: 'disableNotifications',
    fieldSchema: {
      type: Boolean,
      optional: true,
      autoform: {
        omit: true
      }
    }
  });
}
