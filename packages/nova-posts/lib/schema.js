import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';
import marked from 'marked';
import Posts from './collection.js';
import { Utils, getSetting } from 'meteor/nova:core';

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
    publish: true,
    viewableBy: ['guests'],
  },
  /**
    Timetstamp of post creation
  */
  createdAt: {
    type: Date,
    optional: true,
    viewableBy: ['admins'],
    publish: true, // publish so that admins can sort pending posts by createdAt
    autoValue: (documentOrModifier) => {
      if (documentOrModifier && !documentOrModifier.$set) return new Date() // if this is an insert, set createdAt to current timestamp
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
    publish: true,
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
    control: "text",
    publish: true,
    order: 10
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
    publish: true,
    order: 20
  },
  /**
    Slug
  */
  slug: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    publish: true,
    autoValue: (documentOrModifier) => {
      // if title is changing, return new slug
      const newTitle = documentOrModifier.title || documentOrModifier.$set && documentOrModifier.$set.title
      if (newTitle) {
        return Utils.slugify(newTitle)
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
    control: "textarea",
    publish: true,
    order: 30
  },
  /**
    HTML version of the post body
  */
  htmlBody: {
    type: String,
    optional: true,
    publish: true,
    viewableBy: ['guests'],
    autoValue(documentOrModifier) {
      const body = documentOrModifier.body || documentOrModifier.$set && documentOrModifier.$set.body;
      if (body) {
        return Utils.sanitize(marked(body))
      } else if (documentOrModifier.$unset && documentOrModifier.$unset.body) {
        return ''
      }
    }
  },
  /**
   Post Excerpt
   */
  excerpt: {
    type: String,
    optional: true,
    max: 255, //should not be changed the 255 is max we should load for each post/item
    publish: true,
    viewableBy: ['guests'],
    autoValue(documentOrModifier) {
      const excerptLength = getSetting('postExcerptLength', 30);
      const body = documentOrModifier.body || documentOrModifier.$set && documentOrModifier.$set.body;
      if (body) {
        return Utils.trimHTML(Utils.sanitize(marked(body)), excerptLength);
      } else if (documentOrModifier.$unset && documentOrModifier.$unset.body) {
        return ''
      }
    }
  },
  /**
    Count of how many times the post's page was viewed
  */
  viewCount: {
    type: Number,
    optional: true,
    publish: true,
    viewableBy: ['admins'],
    defaultValue: 0
  },
  /**
    Timestamp of the last comment
  */
  lastCommentedAt: {
    type: Date,
    optional: true,
    publish: true,
    viewableBy: ['guests'],
  },
  /**
    Count of how many times the post's link was clicked
  */
  clickCount: {
    type: Number,
    optional: true,
    publish: true,
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
    control: "select",
    autoValue(documentOrModifier) {
      // provide a default value if this is an insert operation and status field is not set in the document
      if (documentOrModifier && !documentOrModifier.$set && documentOrModifier.userId && !documentOrModifier.status) {
        const user = Users.findOne(documentOrModifier.userId);
        return Posts.getDefaultStatus(user);
      }
    },
    form: {
      noselect: true,
      options: Telescope.statuses,
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
    publish: true
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
    publish: true,
    group: formGroups.admin
  },
  /**
    Whether the post is inactive. Inactive posts see their score recalculated less often
  */
  inactive: {
    type: Boolean,
    optional: true,
    publish: false,
    defaultValue: false
  },
  /**
    Save info for later spam checking on a post. We will use this for the akismet package
  */
  userIP: {
    type: String,
    optional: true,
    viewableBy: ['admins'],
    publish: false
  },
  userAgent: {
    type: String,
    optional: true,
    viewableBy: ['admins'],
    publish: false
  },
  referrer: {
    type: String,
    optional: true,
    viewableBy: ['admins'],
    publish: false
  },
  /**
    The post author's name
  */
  author: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    publish: true,
    autoValue: (documentOrModifier) => {
      // if userId is changing, change the author name too
      const userId = documentOrModifier.userId || documentOrModifier.$set && documentOrModifier.$set.userId
      if (userId) return Users.getDisplayNameById(userId)
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
    resolveAs: 'user: User',
    // publish: true,
    // regEx: SimpleSchema.RegEx.Id,
    // insertableBy: ['admins'],
    // editableBy: ['admins'],
    // form: {
    //   group: 'admin',
    //   options: function () {
    //     return Users.find().map(function (user) {
    //       return {
    //         value: user._id,
    //         label: Users.getDisplayName(user)
    //       };
    //     });
    //   }
    // },
    // join: {
    //   joinAs: "user",
    //   collection: () => Users
    // }
  }
};

export default schema;
