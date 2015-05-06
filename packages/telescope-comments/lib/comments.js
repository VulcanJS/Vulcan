/**
 * The global namespace for Comments.
 * @namespace Comments
 */
Comments = new Mongo.Collection("comments");

/**
 * Comments schema
 * @type {SimpleSchema}
 */
Telescope.schemas.comments = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  parentCommentId: {
    type: String,
    editableBy: ["member", "admin"],
    optional: true,
    autoform: {
      omit: true // never show this
    }
  },
  topLevelCommentId: {
    type: String,
    editableBy: ["member", "admin"],
    optional: true,
    autoform: {
      omit: true // never show this
    }
  },
  createdAt: {
    type: Date,
    optional: true
  },
  postedAt: { // for now, comments are always created and posted at the same time
    type: Date,
    optional: true
  },
  body: {
    type: String,
    editableBy: ["member", "admin"],
    autoform: {
      rows: 5
    }
  },
  htmlBody: {
    type: String,
    optional: true
  },
  baseScore: {
    type: Number,
    decimal: true,
    optional: true
  },
  score: {
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
  author: {
    type: String,
    optional: true
  },
  inactive: {
    type: Boolean,
    optional: true
  },
  postId: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"], // TODO: should users be able to set postId, but not modify it?
    autoform: {
      omit: true // never show this
    }
  },
  userId: {
    type: String,
    optional: true
  },
  isDeleted: {
    type: Boolean,
    optional: true
  }
});

Telescope.schemas.comments.internationalize();
Comments.attachSchema(Telescope.schemas.comments);

Comments.allow({
  update: _.partial(Telescope.allowCheck, Comments),
  remove: _.partial(Telescope.allowCheck, Comments)
});
