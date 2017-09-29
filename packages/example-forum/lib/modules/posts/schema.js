/*

Posts schema

*/

import Users from 'meteor/vulcan:users';
import { Posts } from './collection.js';
import { Utils, getSetting, registerSetting } from 'meteor/vulcan:core';
import moment from 'moment';
import marked from 'marked';

registerSetting('forum.postExcerptLength', 30, 'Length of posts excerpts in words');

/**
 * @summary Posts config namespace
 * @type {Object}
 */
const formGroups = {
  admin: {
    name: 'admin',
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
    onInsert: () => {
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
    control: 'datetime',
    group: formGroups.admin,
    onInsert: (post, currentUser) => {
      // Set the post's postedAt if it's going to be approved
      if (!post.postedAt && Posts.getDefaultStatus(currentUser) === Posts.config.STATUS_APPROVED) {
        return new Date();
      }
    }
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
    control: 'url',
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
    control: 'text',
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
    onInsert: (post) => {
      return Utils.slugify(post.title);
    },
    onEdit: (modifier, post) => {
      if (modifier.$set.title) {
        return Utils.slugify(modifier.$set.title);
      }
    }
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
    control: 'textarea',
    order: 30
  },
  /**
    HTML version of the post body
  */
  htmlBody: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    onInsert: (post) => {
      if (post.body) {
        return Utils.sanitize(marked(post.body));
      }
    },
    onEdit: (modifier, post) => {
      if (modifier.$set.body) {
        return Utils.sanitize(marked(modifier.$set.body));
      }
    }
  },
  /**
   Post Excerpt
   */
  excerpt: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    searchable: true,
    onInsert: (post) => {
      if (post.body) {
        // excerpt length is configurable via the settings (30 words by default, ~255 characters)
        const excerptLength = getSetting('forum.postExcerptLength', 30); 
        return Utils.trimHTML(Utils.sanitize(marked(post.body)), excerptLength);
      }
    },
    onEdit: (modifier, post) => {
      if (modifier.$set.body) {
        const excerptLength = getSetting('forum.postExcerptLength', 30); 
        return Utils.trimHTML(Utils.sanitize(marked(modifier.$set.body)), excerptLength);
      }
    }
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
    onInsert: (post) => {
      // Set the post's isFuture to true if necessary
      if (post.postedAt) {
        const postTime = new Date(post.postedAt).getTime();
        const currentTime = new Date().getTime() + 1000;
        return postTime > currentTime; // round up to the second
      }
    },
    onEdit: (modifier, post) => {
      // Set the post's isFuture to true if necessary
      if (modifier.$set.postedAt) {
        const postTime = new Date(modifier.$set.postedAt).getTime();
        const currentTime = new Date().getTime() + 1000;
        if (postTime > currentTime) {
          // if a post's postedAt date is in the future, set isFuture to true
          return true;
        } else if (post.isFuture) {
          // else if a post has isFuture to true but its date is in the past, set isFuture to false
          return false;
        }
      }
    }
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
    control: 'checkbox',
    group: formGroups.admin,
    onInsert: (post) => {
      if(!post.sticky) {
        return false;
      }
    },
    onEdit: (modifier, post) => {
      if (!modifier.$set.sticky) {
        return false;
      }
    }
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
    control: 'select',
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
