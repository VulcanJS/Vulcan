/*

Posts schema

*/

import Users from 'meteor/vulcan:users';
import Posts from './collection.js';
import { Utils } from 'meteor/vulcan:core';
import moment from 'moment';

/**
 * @summary Posts config namespace
 * @type {Object}
 */
const formGroups = {
  admin: {
    name: "admin",
    order: 2
  }
};

/**
 * @summary Posts schema
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
    Timetstamp of post creation
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
    Timestamp of post first appearing on the site (i.e. being approved)
  */
  postedAt: {
    type: Date,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
    control: "datetime",
    group: formGroups.admin
  },
  /**
    URL
  */
  url: {
    type: String,
    optional: true,
    max: 500,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
    control: "url",
    order: 10,
    searchable: true
  },
  /**
    Title
  */
  title: {
    type: String,
    optional: false,
    max: 500,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
    control: "text",
    order: 20,
    searchable: true
  },
  /**
    Slug
  */
  slug: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
  },
  /**
    Post body (markdown)
  */
  body: {
    type: String,
    optional: true,
    max: 3000,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
    control: "textarea",
    order: 30
  },
  /**
    HTML version of the post body
  */
  htmlBody: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
  },
  /**
   Post Excerpt
   */
  excerpt: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    searchable: true
  },
  /**
    Count of how many times the post's page was viewed
  */
  viewCount: {
    type: Number,
    optional: true,
    viewableBy: ['admins'],
    defaultValue: 0
  },
  /**
    Timestamp of the last comment
  */
  lastCommentedAt: {
    type: Date,
    optional: true,
    viewableBy: ['guests'],
  },
  /**
    Count of how many times the post's link was clicked
  */
  clickCount: {
    type: Number,
    optional: true,
    viewableBy: ['admins'],
    defaultValue: 0
  },
  /**
    The post's status. One of pending (`1`), approved (`2`), or deleted (`3`)
  */
  status: {
    type: Number,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
    control: 'select',
    onInsert: document => {
      if (document.userId && !document.status) {
        const user = Users.findOne(document.userId);
        return Posts.getDefaultStatus(user);
      }
    },
    form: {
      noselect: true,
      options: () => Posts.statuses,
      group: 'admin'
    },
    group: formGroups.admin
  },
  /**
    Whether a post is scheduled in the future or not
  */
  isFuture: {
    type: Boolean,
    optional: true,
    viewableBy: ['guests'],
  },
  /**
    Whether the post is sticky (pinned to the top of posts lists)
  */
  sticky: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    viewableBy: ['guests'],
    insertableBy: ['admins'],
    editableBy: ['admins'],
    control: "checkbox",
    group: formGroups.admin
  },
  /**
    Save info for later spam checking on a post. We will use this for the akismet package
  */
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
  /**
    The post author's name
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
    The post author's `_id`.
  */
  userId: {
    type: String,
    optional: true,
    control: "select",
    viewableBy: ['guests'],
    insertableBy: ['members'],
    hidden: true,
    resolveAs: {
      fieldName: 'user',
      type: 'User',
      resolver: async (post, args, context) => {
        if (!post.userId) return null;
        const user = await context.Users.loader.load(post.userId);
        return context.Users.restrictViewableFields(context.currentUser, context.Users, user);
      },
      addOriginalField: true
    },
  },

  /**
    Used to keep track of when a post has been included in a newsletter
  */
  scheduledAt: {
    type: Date,
    optional: true,
    viewableBy: ['admins'],
  },

  // GraphQL-only fields

  domain: {
    type: String,
    optional: true,
    resolveAs: {
      type: 'String',
      resolver: (post, args, context) => {
        return Utils.getDomain(post.url);
      },
    }  
  },

  pageUrl: {
    type: String,
    optional: true,
    resolveAs: {
      type: 'String',
      resolver: (post, args, context) => {
        return Posts.getPageUrl(post, true);
      },
    }  
  },

  linkUrl: {
    type: String,
    optional: true,
    resolveAs: {
      type: 'String',
      resolver: (post, args, context) => {
        return post.url ? Utils.getOutgoingUrl(post.url) : Posts.getPageUrl(post, true);
      },
    }  
  },

  postedAtFormatted: {
    type: String,
    optional: true,
    resolveAs: {
      type: 'String',
      resolver: (booking, args, context) => {
        return moment(booking.endAt).format('dddd, MMMM Do YYYY');
      }
    }  
  },

  commentsCount: {
    type: Number,
    optional: true,
    resolveAs: {
      type: 'Int',
      resolver: (post, args, { Comments }) => {
        const commentsCount = Comments.find({ postId: post._id }).count();
        return commentsCount;
      },
    }  
  },

  comments: {
    type: Array,
    optional: true,
    resolveAs: {
        arguments: 'limit: Int = 5',
        type: '[Comment]',
        resolver: (post, { limit }, { currentUser, Users, Comments }) => {
          const comments = Comments.find({ postId: post._id }, { limit }).fetch();

          // restrict documents fields
          const viewableComments = _.filter(comments, comments => Comments.checkAccess(currentUser, comments));
          const restrictedComments = Users.restrictViewableFields(currentUser, Comments, viewableComments);
        
          return restrictedComments;
        }
      }
  },

};

export default schema;
