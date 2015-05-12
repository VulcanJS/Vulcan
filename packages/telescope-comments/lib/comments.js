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
    optional: true
  },
  /**
    The `_id` of the parent comment, if there is one
  */
  parentCommentId: {
    type: String,
    editableBy: ["member", "admin"],
    optional: true,
    autoform: {
      omit: true // never show this
    }
  },
  /**
    The `_id` of the top-level parent comment, if there is one
  */
  topLevelCommentId: {
    type: String,
    editableBy: ["member", "admin"],
    optional: true,
    autoform: {
      omit: true // never show this
    }
  },
  /**
    The timestamp of comment creation
  */
  createdAt: {
    type: Date,
    optional: true
  },
  /**
    The timestamp of the comment being posted. For now, comments are always created and posted at the same time
  */
  postedAt: {
    type: Date,
    optional: true
  },
  /**
    The comment body (Markdown)
  */
  body: {
    type: String,
    editableBy: ["member", "admin"],
    autoform: {
      rows: 5
    }
  },
  /**
    The HTML version of the comment body
  */
  htmlBody: {
    type: String,
    optional: true
  },
  /**
    The comment's base score (doesn't factor in comment age)
  */
  baseScore: {
    type: Number,
    decimal: true,
    optional: true
  },
  /**
    The comment's current score (factors in comment age)
  */
  score: {
    type: Number,
    decimal: true,
    optional: true
  },
  /**
    The number of upvotes the comment has received
  */
  upvotes: {
    type: Number,
    optional: true
  },
  /**
    An array containing the `_id`s of upvoters
  */
  upvoters: {
    type: [String],
    optional: true
  },
  /**
    The number of downvotes the comment has received
  */
  downvotes: {
    type: Number,
    optional: true
  },
  /**
    An array containing the `_id`s of downvoters
  */
  downvoters: {
    type: [String],
    optional: true
  },
  /**
    The comment author's name
  */
  author: {
    type: String,
    optional: true
  },
  /**
    Whether the comment is inactive. Inactive comments' scores gets recalculated less often
  */
  inactive: {
    type: Boolean,
    optional: true
  },
  /**
    The post's `_id`
  */
  postId: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"], // TODO: should users be able to set postId, but not modify it?
    autoform: {
      omit: true // never show this
    }
  },
  /**
    The comment author's `_id`
  */
  userId: {
    type: String,
    optional: true
  },
  /**
    Whether the comment is deleted. Delete comments' content doesn't appear on the site. 
  */
  isDeleted: {
    type: Boolean,
    optional: true
  }
});

Comments.schema.internationalize();
Comments.attachSchema(Comments.schema);

Comments.allow({
  update: _.partial(Telescope.allowCheck, Comments),
  remove: _.partial(Telescope.allowCheck, Comments)
});
