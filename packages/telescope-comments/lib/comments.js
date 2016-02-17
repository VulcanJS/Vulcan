/**
 * The global namespace for Comments.
 * @namespace Comments
 */
Comments = new Mongo.Collection("comments");

/**
 * Comments schema
 * @type {SimpleSchema}
 */
Comments.schema = new SimpleSchema({
  /**
    ID
  */
  _id: {
    type: String,
    optional: true,
    public: true,
  },
  /**
    The `_id` of the parent comment, if there is one
  */
  parentCommentId: {
    type: String,
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    editableBy: ["member", "admin"],
    optional: true,
    public: true,
    autoform: {
      omit: true // never show this
    }
  },
  /**
    The `_id` of the top-level parent comment, if there is one
  */
  topLevelCommentId: {
    type: String,
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    editableBy: ["member", "admin"],
    optional: true,
    public: true,
    autoform: {
      omit: true // never show this
    }
  },
  /**
    The timestamp of comment creation
  */
  createdAt: {
    type: Date,
    optional: true,
    public: true,
  },
  /**
    The timestamp of the comment being posted. For now, comments are always created and posted at the same time
  */
  postedAt: {
    type: Date,
    optional: true,
    public: true,
  },
  /**
    The comment body (Markdown)
  */
  body: {
    type: String,
    max: 3000,
    editableBy: ["member", "admin"],
    public: true,
    autoform: {
      rows: 5,
      afFormGroup: {
        'formgroup-class': 'hide-label'
      }
    }
  },
  /**
    The HTML version of the comment body
  */
  htmlBody: {
    type: String,
    optional: true,
    public: true,
  },
  /**
    The comment's base score (doesn't factor in comment age)
  */
  baseScore: {
    type: Number,
    decimal: true,
    optional: true,
    public: true,
  },
  /**
    The comment's current score (factors in comment age)
  */
  score: {
    type: Number,
    decimal: true,
    optional: true,
    public: true,
  },
  /**
    The number of upvotes the comment has received
  */
  upvotes: {
    type: Number,
    optional: true,
    public: true,
  },
  /**
    An array containing the `_id`s of upvoters
  */
  upvoters: {
    type: [String],
    optional: true,
    public: true,
  },
  /**
    The number of downvotes the comment has received
  */
  downvotes: {
    type: Number,
    optional: true,
    public: true,
  },
  /**
    An array containing the `_id`s of downvoters
  */
  downvoters: {
    type: [String],
    optional: true,
    public: true,
  },
  /**
    The comment author's name
  */
  author: {
    type: String,
    optional: true,
    public: true,
  },
  /**
    Whether the comment is inactive. Inactive comments' scores gets recalculated less often
  */
  inactive: {
    type: Boolean,
    optional: true,
    public: true,
  },
  /**
    The post's `_id`
  */
  postId: {
    type: String,
    optional: true,
    public: true,
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    // editableBy: ["member", "admin"], // TODO: should users be able to set postId, but not modify it?
    autoform: {
      omit: true // never show this
    }
  },
  /**
    The comment author's `_id`
  */
  userId: {
    type: String,
    optional: true,
    public: true,
  },
  /**
    Whether the comment is deleted. Delete comments' content doesn't appear on the site. 
  */
  isDeleted: {
    type: Boolean,
    optional: true,
    public: true,
  }
});

// Meteor.startup(function(){
//   // needs to happen after every fields are added
//   Comments.internationalize();
// });

Comments.attachSchema(Comments.schema);