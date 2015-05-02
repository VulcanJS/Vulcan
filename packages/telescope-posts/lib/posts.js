/**
 * The global namespace for Posts.
 * @namespace Posts
 */
Posts = new Mongo.Collection("posts");

/**
 * Posts schema
 * @type {SimpleSchema}
 */
Telescope.schemas.posts = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true
  },
  postedAt: {
    type: Date,
    optional: true,
    editableBy: ["admin"],
    autoform: {
      group: 'admin',
      type: "bootstrap-datetimepicker"
    }
  },
  url: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"],
    autoform: {
      type: "bootstrap-url"
    }
  },
  title: {
    type: String,
    optional: false,
    editableBy: ["member", "admin"]
  },
  body: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"],
    autoform: {
      rows: 5
    }
  },
  htmlBody: {
    type: String,
    optional: true
  },
  viewCount: {
    type: Number,
    optional: true
  },
  commentCount: {
    type: Number,
    optional: true
  },
  commenters: {
    type: [String],
    optional: true
  },
  lastCommentedAt: {
    type: Date,
    optional: true
  },
  clickCount: {
    type: Number,
    optional: true
  },
  baseScore: {
    type: Number,
    decimal: true,
    optional: true
  },
  upvotes: {
    type: Number,
    optional: true
  },
  upvoters: {
    type: [String],
    optional: true
  },
  downvotes: {
    type: Number,
    optional: true
  },
  downvoters: {
    type: [String],
    optional: true
  },
  score: {
    type: Number,
    decimal: true,
    optional: true
  },
  status: {
    type: Number,
    optional: true,
    editableBy: ["admin"],
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
      options: Telescope.config.postStatuses,
      group: 'admin'
    }
  },
  sticky: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    editableBy: ["admin"],
    autoform: {
      group: 'admin',
      leftLabel: "Sticky"
    }
  },
  inactive: {
    type: Boolean,
    optional: true
  },
  author: {
    type: String,
    optional: true
  },
  userId: {
    type: String, // XXX
    optional: true,
    editableBy: ["admin"],
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
    }
  }
});

// schema transforms
Telescope.schemas.posts.internationalize();


/**
 * Attach schema to Posts collection
 */
Posts.attachSchema(Telescope.schemas.posts);

Posts.allow({
  update: _.partial(Telescope.allowCheck, Posts),
  remove: _.partial(Telescope.allowCheck, Posts)
});

//////////////////////////////////////////////////////
// Collection Hooks                                 //
// https://atmospherejs.com/matb33/collection-hooks //
//////////////////////////////////////////////////////

/**
 * Generate HTML body from Markdown on post insert
 */
Posts.before.insert(function (userId, doc) {
  if(!!doc.body)
    doc.htmlBody = Telescope.utils.sanitize(marked(doc.body));
});

/**
 * Generate HTML body from Markdown when post body is updated
 */
Posts.before.update(function (userId, doc, fieldNames, modifier) {
  // if body is being modified, update htmlBody too
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {
    modifier.$set.htmlBody = Telescope.utils.sanitize(marked(modifier.$set.body));
  }
});
