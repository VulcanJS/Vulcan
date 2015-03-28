commentSchemaObject = {
  _id: {
    type: String,
    optional: true
  },
  parentCommentId: {
    type: String,
    optional: true,
    autoform: {
      editable: true,
      omit: true
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
    autoform: {
      editable: true
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
    type: [String], // XXX
    optional: true
  },
  downvotes: {
      type: Number,
      optional: true
  },
  downvoters: {
    type: [String], // XXX
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
    type: String, // XXX
    optional: true,
    autoform: {
      editable: true,
      omit: true
    }
  },
  userId: {
    type: String, // XXX
    optional: true
  },
  isDeleted: {
    type: Boolean,
    optional: true
  }
};

// add any extra properties to commentSchemaObject (provided by packages for example)
_.each(addToCommentsSchema, function(item){
  commentSchemaObject[item.propertyName] = item.propertySchema;
});

Comments = new Meteor.Collection("comments");

commentSchema = new SimpleSchema(commentSchemaObject);

Comments.attachSchema(commentSchema);

Comments.deny({
  update: function(userId, post, fieldNames) {
    if(isAdminById(userId))
      return false;
    // deny the update if it contains something other than the following fields
    return (_.without(fieldNames, 'body').length > 0);
  }
});

Comments.allow({
  update: can.editById,
  remove: can.editById
});

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------ Hooks ------------------------------------------ //
// ------------------------------------------------------------------------------------------- //

Comments.before.insert(function (userId, doc) {
  // note: only actually sanitizes on the server
  doc.htmlBody = sanitize(marked(doc.body));
});

Comments.before.update(function (userId, doc, fieldNames, modifier, options) {
  // if body is being modified, update htmlBody too
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {
    modifier.$set = modifier.$set || {};
    modifier.$set.htmlBody = sanitize(marked(modifier.$set.body));
  }
});

commentAfterSubmitMethodCallbacks.push(function (comment) {

  var userId = comment.userId,
    commentAuthor = Meteor.users.findOne(userId);

  // increment comment count
  Meteor.users.update({_id: userId}, {
    $inc:       {'commentCount': 1}
  });

  // update post
  Posts.update(comment.postId, {
    $inc:       {commentCount: 1},
    $set:       {lastCommentedAt: new Date()},
    $addToSet:  {commenters: userId}
  });

  // upvote comment
  upvoteItem(Comments, comment, commentAuthor);

});

// ------------------------------------------------------------------------------------------- //
// -------------------------------------- Submit Comment ------------------------------------- //
// ------------------------------------------------------------------------------------------- //

submitComment = function (comment) {

  var userId = comment.userId; // at this stage, a userId is expected

  // ------------------------------ Checks ------------------------------ //

  // Don't allow empty comments
  if (!comment.body)
    throw new Meteor.Error(704,i18n.t('your_comment_is_empty'));

  // ------------------------------ Properties ------------------------------ //

  var defaultProperties = {
    createdAt: new Date(),
    postedAt: new Date(),
    upvotes: 0,
    downvotes: 0,
    baseScore: 0,
    score: 0,
    author: getDisplayNameById(userId)
  };

  comment = _.extend(defaultProperties, comment);

  // ------------------------------ Callbacks ------------------------------ //

  // run all post submit server callbacks on comment object successively
  comment = commentSubmitMethodCallbacks.reduce(function(result, currentFunction) {
      return currentFunction(result);
  }, comment);

  // -------------------------------- Insert -------------------------------- //

  comment._id = Comments.insert(comment);

  // --------------------- Server-side Async Callbacks --------------------- //

  // run all post submit server callbacks on comment object successively
  if (Meteor.isServer) {
    Meteor.setTimeout(function () { // use setTimeout to avoid holding up client
      comment = commentAfterSubmitMethodCallbacks.reduce(function(result, currentFunction) {
          return currentFunction(result);
      }, comment);
    }, 1);
  }

  return comment;
}

// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- Methods ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

Meteor.methods({
  submitComment: function(comment){

    // required properties:
    // postId
    // body

    // optional properties:
    // parentCommentId

    var user = Meteor.user(),
        hasAdminRights = isAdmin(user);

    // ------------------------------ Checks ------------------------------ //

    // check that user can comment
    if (!user || !can.comment(user))
      throw new Meteor.Error(i18n.t('you_need_to_login_or_be_invited_to_post_new_comments'));

    // ------------------------------ Rate Limiting ------------------------------ //

    if (!hasAdminRights) {

      var timeSinceLastComment = timeSinceLast(user, Comments),
          commentInterval = Math.abs(parseInt(Settings.get('commentInterval',15)));

      // check that user waits more than 15 seconds between comments
      if((timeSinceLastComment < commentInterval))
        throw new Meteor.Error(704, i18n.t('please_wait')+(commentInterval-timeSinceLastComment)+i18n.t('seconds_before_commenting_again'));

    }

    // ------------------------------ Properties ------------------------------ //

    // admin-only properties
    // userId

    // if user is not admin, clear restricted properties
    if (!hasAdminRights) {
      _.keys(comment).forEach(function (propertyName) {
        var property = commentSchemaObject[propertyName];
        if (!property || !property.autoform || !property.autoform.editable) {
          console.log("// Disallowed property detected: "+propertyName+" (nice try!)");
          delete comment[propertyName]
        }
      });
    }

    // if no userId has been set, default to current user id
    if (!comment.userId) {
      comment.userId = user._id
    }

    return submitComment(comment);
  },
  removeComment: function(commentId){
    var comment = Comments.findOne(commentId);
    if(can.edit(Meteor.user(), comment)){
      // decrement post comment count and remove user ID from post
      Posts.update(comment.postId, {
        $inc:   {commentCount: -1},
        $pull:  {commenters: comment.userId}
      });

      // decrement user comment count and remove comment ID from user
      Meteor.users.update({_id: comment.userId}, {
        $inc:   {'commentCount': -1}
      });

      // note: should we also decrease user's comment karma ?
      // We don't actually delete the comment to avoid losing all child comments.
      // Instead, we give it a special flag
      Comments.update({_id: commentId}, {$set: {
        body: 'Deleted',
        htmlBody: 'Deleted',
        isDeleted: true
      }});
    }else{
      Messages.flash("You don't have permission to delete this comment.", "error");
    }
  }
});
