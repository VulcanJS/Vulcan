import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import mutations from './mutations.js';

/**
 * @summary Comments schema
 * @type {Object}
 */
const schema = {
  /**
    ID
  */
  _id: {
    type: String,
    optional: true,
    publish: true,
    viewableIf: ['anonymous'],
  },
  /**
    The `_id` of the parent comment, if there is one
  */
  parentCommentId: {
    type: String,
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    viewableIf: ['anonymous'],
    insertableIf: ['default'],
    optional: true,
    publish: true,
    resolveAs: 'parentComment: Comment',
    hidden: true // never show this
  },
  /**
    The `_id` of the top-level parent comment, if there is one
  */
  topLevelCommentId: {
    type: String,
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    viewableIf: ['anonymous'],
    insertableIf: ['default'],
    optional: true,
    publish: true,
    resolveAs: 'topLevelComment: Comment',
    hidden: true // never show this
  },
  /**
    The timestamp of comment creation
  */
  createdAt: {
    type: Date,
    optional: true,
    publish: false,
    viewableIf: ['admins'],
    autoValue: (documentOrModifier) => {
      if (documentOrModifier && !documentOrModifier.$set) return new Date() // if this is an insert, set createdAt to current timestamp  
    }
  },
  /**
    The timestamp of the comment being posted. For now, comments are always created and posted at the same time
  */
  postedAt: {
    type: Date,
    optional: true,
    publish: true,
    viewableIf: ['anonymous'],    
    autoValue: (documentOrModifier) => {
      if (documentOrModifier && !documentOrModifier.$set) return new Date() // if this is an insert, set createdAt to current timestamp  
    }
  },
  /**
    The comment body (Markdown)
  */
  body: {
    type: String,
    max: 3000,
    viewableIf: ['anonymous'],
    insertableIf: ['default'],
    editableIf: ['default'],
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
    viewableIf: ['anonymous'],
  },
  /**
    The comment author's name
  */
  author: {
    type: String,
    optional: true,
    publish: true,
    viewableIf: ['anonymous'],
    autoValue: (documentOrModifier) => {
      // if userId is changing, change the author name too
      const userId = documentOrModifier.userId || documentOrModifier.$set && documentOrModifier.$set.userId
      if (userId) return Users.getDisplayNameById(userId)
    }
  },
  /**
    Whether the comment is inactive. Inactive comments' scores gets recalculated less often
  */
  inactive: {
    type: Boolean,
    optional: true,
    publish: true,
    viewableIf: ['anonymous'],
  },
  /**
    The post's `_id`
  */
  postId: {
    type: String,
    optional: true,
    publish: true,
    viewableIf: ['anonymous'],
    insertableIf: ['default'],
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    resolveAs: 'post: Post',
    hidden: true // never show this
  },
  /**
    The comment author's `_id`
  */
  userId: {
    type: String,
    optional: true,
    publish: true,
    viewableIf: ['anonymous'],
    insertableIf: ['default'],
    hidden: true,
    resolveAs: 'user: User',
    // join: {
    //   joinAs: "user",
    //   collection: () => Users
    // },
  },
  /**
    Whether the comment is deleted. Delete comments' content doesn't appear on the site. 
  */
  isDeleted: {
    type: Boolean,
    optional: true,
    publish: true,
    viewableIf: ['anonymous'],
  },
  userIP: {
    type: String,
    optional: true,
    publish: false,
    viewableIf: ['admins'],
  },
  userAgent: {
    type: String,
    optional: true,
    publish: false,
    viewableIf: ['admins'],
  },
  referrer: {
    type: String,
    optional: true,
    publish: false,
    viewableIf: ['admins'],
  }
};

export default schema;

// todo: move to nova:notifications
// if (typeof Telescope.notifications !== "undefined") {
//   Comments.addField({
//     fieldName: 'disableNotifications',
//     fieldSchema: {
//       type: Boolean,
//       optional: true,
//       hidden: true // never show this
//     }
//   });
// }
