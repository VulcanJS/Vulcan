/*

Comments schema

*/

import Users from 'meteor/vulcan:users';
import marked from 'marked';
import { Utils } from 'meteor/vulcan:core';

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
    viewableBy: ['guests'],
  },
  /**
    The `_id` of the parent comment, if there is one
  */
  parentCommentId: {
    type: String,
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    optional: true,
    resolveAs: {
      fieldName: 'parentComment',
      type: 'Comment',
      resolver: async (comment, args, {currentUser, Users, Comments}) => {
        if (!comment.parentCommentId) return null;
        const parentComment = await Comments.loader.load(comment.parentCommentId);
        return Users.restrictViewableFields(currentUser, Comments, parentComment);
      },
      addOriginalField: true
    },
    hidden: true // never show this
  },
  /**
    The `_id` of the top-level parent comment, if there is one
  */
  topLevelCommentId: {
    type: String,
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    optional: true,
    resolveAs: {
      fieldName: 'topLevelComment',
      type: 'Comment',
      resolver: async (comment, args, {currentUser, Users, Comments}) => {
        if (!comment.topLevelCommentId) return null;
        const topLevelComment = await Comments.loader.load(comment.topLevelCommentId);
        return Users.restrictViewableFields(currentUser, Comments, topLevelComment);
      },
      addOriginalField: true
    },
    hidden: true // never show this
  },
  /**
    The timestamp of comment creation
  */
  createdAt: {
    type: Date,
    optional: true,
    viewableBy: ['admins'],
    onInsert: (document, currentUser) => {
      return new Date();
    }
  },
  /**
    The timestamp of the comment being posted. For now, comments are always created and posted at the same time
  */
  postedAt: {
    type: Date,
    optional: true,
    viewableBy: ['guests'],
    onInsert: (document, currentUser) => {
      return new Date();
    }
  },
  /**
    The comment body (Markdown)
  */
  body: {
    type: String,
    max: 3000,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
    control: "textarea"
  },
  /**
    The HTML version of the comment body
  */
  htmlBody: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    onInsert: (comment) => {
      if (comment.body) {
        return Utils.sanitize(marked(comment.body));
      }
    },
    onEdit: (modifier, comment) => {
      if (modifier.$set.body) {
        return Utils.sanitize(marked(modifier.$set.body));
      }
    }
  },
  /**
    The comment author's name
  */
  author: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    onEdit: (modifier, document, currentUser) => {
      // if userId is changing, change the author name too
      if (modifier.$set && modifier.$set.userId) {
        return Users.getDisplayNameById(modifier.$set.userId)
      }
    }
  },
  /**
    The post's `_id`
  */
  postId: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    resolveAs: {
      fieldName: 'post',
      type: 'Post',
      resolver: async (comment, args, {currentUser, Users, Posts}) => {
        if (!comment.postId) return null;
        const post = await Posts.loader.load(comment.postId);
        return Users.restrictViewableFields(currentUser, Posts, post);
      },
      addOriginalField: true
    },
    hidden: true // never show this
  },
  /**
    The comment author's `_id`
  */
  userId: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    hidden: true,
    resolveAs: {
      fieldName: 'user',
      type: 'User',
      resolver: async (comment, args, {currentUser, Users}) => {
        if (!comment.userId) return null;
        const user = await Users.loader.load(comment.userId);
        return Users.restrictViewableFields(currentUser, Users, user);
      },
      addOriginalField: true
    },
  },
  /**
    Whether the comment is deleted. Delete comments' content doesn't appear on the site.
  */
  isDeleted: {
    type: Boolean,
    optional: true,
    viewableBy: ['guests'],
  },
  userIP: {
    type: String,
    optional: true,
    viewableBy: ['admins'],
  },
  userAgent: {
    type: String,
    optional: true,
    viewableBy: ['admins'],
  },
  referrer: {
    type: String,
    optional: true,
    viewableBy: ['admins'],
  },

  // GraphQL only fields

  pageUrl: {
    type: String,
    optional: true,
    resolveAs: {
      fieldName: 'pageUrl',
      type: 'String',
      resolver: (comment, args, context) => {
        return context.Comments.getPageUrl(comment, true);
      },
    }  
  },
};

export default schema;
