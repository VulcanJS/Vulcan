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
    optional: true
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
    editableBy: ["owner", "admin"],
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
    optional: true
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

/**
 * Attach schema to Posts collection
 */


// Note: is the allow/deny code still needed?

Comments.deny({
  update: function(userId, post, fieldNames) {
    if(Users.is.adminById(userId))
      return false;
    // deny the update if it contains something other than the following fields
    return (_.without(fieldNames, 'body').length > 0);
  }
});

Comments.allow({
  update: Users.can.editById,
  remove: Users.can.editById
});
