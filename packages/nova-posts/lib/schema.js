import Posts from './collection.js';
import Users from 'meteor/nova:users';

/**
 * @summary Posts config namespace
 * @type {Object}
 */
Posts.config = {};

/**
 * @summary Post Statuses
 */
Posts.config.postStatuses = [
  {
    value: 1,
    label: 'pending'
  },
  {
    value: 2,
    label: 'approved'
  },
  {
    value: 3,
    label: 'rejected'
  },
  {
    value: 4,
    label: 'spam'
  },
  {
    value: 5,
    label: 'deleted'
  }
];

Posts.config.STATUS_PENDING = 1;
Posts.config.STATUS_APPROVED = 2;
Posts.config.STATUS_REJECTED = 3;
Posts.config.STATUS_SPAM = 4;
Posts.config.STATUS_DELETED = 5;

const adminGroup = {
  name: "admin",
  order: 2
}

/**
 * @summary Posts schema
 * @type {SimpleSchema}
 */
Posts.schemaJSON = {
  /**
    ID
  */
  _id: {
    type: String,
    optional: true,
    publish: true
  },
  /**
    Timetstamp of post creation
  */
  createdAt: {
    type: Date,
    optional: true,
    publish: true // publish so that admins can sort pending posts by createdAt
  },
  /**
    Timestamp of post first appearing on the site (i.e. being approved)
  */
  postedAt: {
    type: Date,
    optional: true,
    // insertableIf: Users.is.admin,
    // editableIf: Users.is.admin,
    publish: true,
    control: "datetime",
    group: adminGroup
  },
  /**
    URL
  */
  url: {
    type: String,
    optional: true,
    max: 500,
    insertableIf: Users.is.memberOrAdmin,
    editableIf: Users.is.ownerOrAdmin,
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
    insertableIf: Users.is.memberOrAdmin,
    editableIf: Users.is.ownerOrAdmin,
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
    publish: true,
  },
  /**
    Post body (markdown)
  */
  body: {
    type: String,
    optional: true,
    max: 3000,
    insertableIf: Users.is.memberOrAdmin,
    editableIf: Users.is.ownerOrAdmin,
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
  },
  /**
   Post Excerpt
   */
  excerpt: {
    type: String,
    optional: true,
    max: 255, //should not be changed the 255 is max we should load for each post/item
    publish: true,
  },
  /**
    Count of how many times the post's page was viewed
  */
  viewCount: {
    type: Number,
    optional: true,
    publish: true,
    defaultValue: 0
  },
  /**
    Timestamp of the last comment
  */
  lastCommentedAt: {
    type: Date,
    optional: true,
    publish: true,
  },
  /**
    Count of how many times the post's link was clicked
  */
  clickCount: {
    type: Number,
    optional: true,
    publish: true,
    defaultValue: 0
  },
  /**
    The post's status. One of pending (`1`), approved (`2`), or deleted (`3`)
  */
  status: {
    type: Number,
    optional: true,
    insertableIf: Users.is.admin,
    editableIf: Users.is.admin,
    control: "select",
    publish: true,
    autoValue: function () {
      // only provide a default value
      // 1) this is an insert operation
      // 2) status field is not set in the document being inserted
      var user = Meteor.users.findOne(this.userId);
      if (this.isInsert && !this.isSet)
        return Posts.getDefaultStatus(user);
    },
    autoform: {
      noselect: true,
      options: Posts.config.postStatuses,
      group: 'admin'
    },
    group: adminGroup
  },
  /**
    Whether the post is sticky (pinned to the top of posts lists)
  */
  sticky: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    insertableIf: Users.is.admin,
    editableIf: Users.is.admin,
    control: "checkbox",
    publish: true,
    group: adminGroup
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
  },
  /**
    The post author's name
  */
  author: {
    type: String,
    optional: true,
    publish: true,
  },
  /**
    The post author's `_id`. 
  */
  userId: {
    type: String,
    optional: true,
    // regEx: SimpleSchema.RegEx.Id,
    // insertableIf: Users.is.admin,
    // editableIf: Users.is.admin,
    control: "select",
    publish: true,
    autoform: {
      group: 'admin',
      options: function () {
        return Meteor.users.find().map(function (user) {
          return {
            value: user._id,
            label: Users.getDisplayName(user)
          };
        });
      }
    },
    join: {
      joinAs: "user",
      collection: () => Meteor.users
    }
  }
};

if (typeof SimpleSchema !== "undefined") {
  Posts.schema = new SimpleSchema(Posts.schemaJSON);
  Posts.attachSchema(Posts.schema);
}
