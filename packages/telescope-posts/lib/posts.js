/**
 * The global namespace for Posts.
 * @namespace Posts
 */
Posts = new Mongo.Collection("posts");

/**
 * Posts schema
 * @type {SimpleSchema}
 */
var postsSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  createdAt: {
    type: Date,
    optional: true,
    autoform: {
      omit: true
    }
  },
  postedAt: {
    type: Date,
    optional: true,
    autoform: {
      group: 'admin',
      type: "bootstrap-datetimepicker"
    }
  },
  url: {
    type: String,
    optional: true,
    editableBy: ['owner'],
    autoform: {
      editable: true,
      type: "bootstrap-url"
    }
  },
  title: {
    type: String,
    optional: false,
    editableBy: ['owner'],
    autoform: {
      editable: true
    }
  },
  body: {
    type: String,
    optional: true,
    editableBy: ['owner'],
    autoform: {
      editable: true,
      rows: 5
    }
  },
  htmlBody: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  viewCount: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  commentCount: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  commenters: {
    type: [String],
    optional: true,
    autoform: {
      omit: true
    }
  },
  lastCommentedAt: {
    type: Date,
    optional: true,
    autoform: {
      omit: true
    }
  },
  clickCount: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  baseScore: {
    type: Number,
    decimal: true,
    optional: true,
    autoform: {
      omit: true
    }
  },
  upvotes: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  upvoters: {
    type: [String], // XXX
    optional: true,
    autoform: {
      omit: true
    }
  },
  downvotes: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  },
  downvoters: {
    type: [String], // XXX
    optional: true,
    autoform: {
      omit: true
    }
  },
  score: {
    type: Number,
    decimal: true,
    optional: true,
    autoform: {
      omit: true
    }
  },
  status: {
    type: Number,
    optional: true,
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
    autoform: {
      group: 'admin',
      leftLabel: "Sticky"
    }
  },
  inactive: {
    type: Boolean,
    optional: true,
    autoform: {
      omit: true
    }
  },
  author: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  userId: {
    type: String, // XXX
    optional: true,
    autoform: {
      group: 'admin',
      options: function () {
        return Meteor.users.find().map(function (user) {
          return {
            value: user._id,
            label: Users.getDisplayName(user)
          }
        });
      }
    }
  }
});

/**
 * Attach schema to Posts collection
 */
Posts.attachSchema(postsSchema);

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
Posts.before.update(function (userId, doc, fieldNames, modifier, options) {
  // if body is being modified, update htmlBody too
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {
    modifier.$set.htmlBody = Telescope.utils.sanitize(marked(modifier.$set.body));
  }
});