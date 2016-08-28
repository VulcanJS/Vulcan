import Telescope from 'meteor/nova:lib';
import Posts from './collection.js';
import Users from 'meteor/nova:users';

/**
 * @summary Posts config namespace
 * @type {Object}
 */
Posts.config = {};

Posts.config.STATUS_PENDING = 1;
Posts.config.STATUS_APPROVED = 2;
Posts.config.STATUS_REJECTED = 3;
Posts.config.STATUS_SPAM = 4;
Posts.config.STATUS_DELETED = 5;

Posts.formGroups = {
  admin: {
    name: "admin",
    order: 2
  }
};

// check if user can create a new post
const canInsert = user => Users.canDo(user, "posts.new");

// check if user can edit a post
const canEdit = Users.canEdit;

// check if user can edit *all* posts
const canEditAll = user => Users.canDo(user, "posts.edit.all");

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
    insertableIf: canEditAll,
    editableIf: canEditAll,
    publish: true,
    control: "datetime",
    group: Posts.formGroups.admin
  },
  /**
    URL
  */
  url: {
    type: String,
    optional: true,
    max: 500,
    insertableIf: canInsert,
    editableIf: canEdit,
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
    insertableIf: canInsert,
    editableIf: canEdit,
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
    insertableIf: canInsert,
    editableIf: canEdit,
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
    insertableIf: canEditAll,
    editableIf: canEditAll,
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
      options: Telescope.statuses,
      group: 'admin'
    },
    group: Posts.formGroups.admin
  },
  /**
    Whether a post is scheduled in the future or not
  */
  isFuture: {
    type: Boolean,
    optional: true,
    publish: true
  },
  /**
    Whether the post is sticky (pinned to the top of posts lists)
  */
  sticky: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    insertableIf: canEditAll,
    editableIf: canEditAll,
    control: "checkbox",
    publish: true,
    group: Posts.formGroups.admin
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
    // insertableIf: canEditAll,
    // editableIf: canEditAll,
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
