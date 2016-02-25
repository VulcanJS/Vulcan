/**
 * Posts schema
 * @type {SimpleSchema}
 */
Posts.schema = new SimpleSchema({
  /**
    ID
  */
  _id: {
    type: String,
    optional: true,
    public: true
  },
  /**
    Timetstamp of post creation
  */
  createdAt: {
    type: Date,
    optional: true,
    public: false
  },
  /**
    Timestamp of post first appearing on the site (i.e. being approved)
  */
  postedAt: {
    type: Date,
    optional: true,
    editableBy: ["admin"],
    public: true,
    control: "datepicker",
    autoform: {
      group: 'admin',
      type: "bootstrap-datetimepicker"
    }
  },
  /**
    URL
  */
  url: {
    type: String,
    optional: true,
    max: 500,
    editableBy: ["member", "admin"],
    control: "text",
    public: true,
    autoform: {
      type: "bootstrap-url",
      order: 10
    }
  },
  /**
    Title
  */
  title: {
    type: String,
    optional: false,
    max: 500,
    editableBy: ["member", "admin"],
    control: "text",
    public: true,
    autoform: {
      order: 20
    }
  },
  /**
    Slug
  */
  slug: {
    type: String,
    optional: true,
    public: true,
  },
  /**
    Post body (markdown)
  */
  body: {
    type: String,
    optional: true,
    max: 3000,
    editableBy: ["member", "admin"],
    control: "textarea",
    public: true,
    autoform: {
      rows: 5,
      order: 30
    }
  },
  /**
    HTML version of the post body
  */
  htmlBody: {
    type: String,
    optional: true,
    public: true,
  },
  /**
    Count of how many times the post's page was viewed
  */
  viewCount: {
    type: Number,
    optional: true,
    public: true,
  },
  /**
    Timestamp of the last comment
  */
  lastCommentedAt: {
    type: Date,
    optional: true,
    public: true,
  },
  /**
    Count of how many times the post's link was clicked
  */
  clickCount: {
    type: Number,
    optional: true,
    public: true,
  },
  /**
    The post's status. One of pending (`1`), approved (`2`), or deleted (`3`)
  */
  status: {
    type: Number,
    optional: true,
    editableBy: ["admin"],
    control: "radiogroup",
    public: true,
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
    }
  },
  /**
    Whether the post is sticky (pinned to the top of posts lists)
  */
  sticky: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    editableBy: ["admin"],
    control: "checkbox",
    public: true,
    autoform: {
      group: 'admin',
      leftLabel: "Sticky"
    }
  },
  /**
    Whether the post is inactive. Inactive posts see their score recalculated less often
  */
  inactive: {
    type: Boolean,
    optional: true,
    public: false,
  },
  /**
    Save info for later spam checking on a post. We will use this for the akismet package
  */
  userIP: {
    type: String,
    optional: true,
    public: false,
  },
  userAgent: {
    type: String,
    optional: true,
    public: false,
  },
  referrer: {
    type: String,
    optional: true,
    public: false,
  },
  /**
    The post author's name
  */
  author: {
    type: String,
    optional: true,
    public: true,
  },
  /**
    The post author's `_id`. 
  */
  userId: {
    type: String,
    optional: true,
    // regEx: SimpleSchema.RegEx.Id,
    editableBy: ["admin"],
    control: "radiogroup",
    public: true,
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
      collection: "Users"
    }
  }
});

// schema transforms
// Meteor.startup(function(){
//   // needs to happen after every fields were added
//   Posts.internationalize();
// });

/**
 * Attach schema to Posts collection
 */
Posts.attachSchema(Posts.schema);
