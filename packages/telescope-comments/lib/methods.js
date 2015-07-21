
// ------------------------------------------------------------------------------------------- //
// -------------------------------------- Submit Comment ------------------------------------- //
// ------------------------------------------------------------------------------------------- //

Comments.submit = function (comment) {

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
    author: Users.getDisplayNameById(userId)
  };

  comment = _.extend(defaultProperties, comment);

  // ------------------------------ Callbacks ------------------------------ //

  // run all post submit server callbacks on comment object successively
  comment = Telescope.callbacks.run("commentSubmit", comment);

  // -------------------------------- Insert -------------------------------- //

  comment._id = Comments.insert(comment);

  // --------------------- Server-side Async Callbacks --------------------- //

  // run all post submit server callbacks on comment object successively
  // note: query for comment to get fresh document with collection-hooks effects applied
  Telescope.callbacks.runAsync("commentSubmitAsync", Comments.findOne(comment._id));

  return comment;
};

Comments.edit = function (commentId, modifier, comment) {

  // ------------------------------ Callbacks ------------------------------ //

  modifier = Telescope.callbacks.run("commentEdit", modifier, comment);

  // ------------------------------ Update ------------------------------ //

  Comments.update(commentId, modifier);

  // ------------------------------ Callbacks ------------------------------ //

  Telescope.callbacks.runAsync("commentEditAsync", Comments.findOne(commentId));

  // ------------------------------ After Update ------------------------------ //
  return Comments.findOne(commentId);
};

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
        hasAdminRights = Users.is.admin(user),
        schema = Comments.simpleSchema()._schema;

    // ------------------------------ Checks ------------------------------ //

    // check that user can comment
    if (!user || !Users.can.comment(user))
      throw new Meteor.Error(i18n.t('you_need_to_login_or_be_invited_to_post_new_comments'));

    // ------------------------------ Rate Limiting ------------------------------ //

    if (!hasAdminRights) {

      var timeSinceLastComment = Users.timeSinceLast(user, Comments),
          commentInterval = Math.abs(parseInt(Settings.get('commentInterval',15)));

      // check that user waits more than 15 seconds between comments
      if((timeSinceLastComment < commentInterval))
        throw new Meteor.Error(704, i18n.t('please_wait')+(commentInterval-timeSinceLastComment)+i18n.t('seconds_before_commenting_again'));

    }

    // ------------------------------ Properties ------------------------------ //

    // admin-only properties
    // userId

    // clear restricted properties
    _.keys(comment).forEach(function (fieldName) {

      var field = schema[fieldName];
      if (!Users.can.submitField(user, field)) {
        throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);
      }

    });

    // if no userId has been set, default to current user id
    if (!comment.userId) {
      comment.userId = user._id;
    }

    return Comments.submit(comment);
  },

  editComment: function (modifier, commentId) {

    var user = Meteor.user(),
        comment = Comments.findOne(commentId),
        schema = Comments.simpleSchema()._schema;

    // ------------------------------ Checks ------------------------------ //

    // check that user can edit
    if (!user || !Users.can.edit(user, comment)) {
      throw new Meteor.Error(601, i18n.t('sorry_you_cannot_edit_this_comment'));
    }

    // go over each field and throw an error if it's not editable
    // loop over each operation ($set, $unset, etc.)
    _.each(modifier, function (operation) {
      // loop over each property being operated on
      _.keys(operation).forEach(function (fieldName) {

        var field = schema[fieldName];
        if (!Users.can.editField(user, field, comment)) {
          throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);
        }

      });
    });

    Comments.edit(commentId, modifier, comment);
  },

  deleteCommentById: function (commentId) {

    var comment = Comments.findOne(commentId);
    var user = Meteor.user();

    if(Users.can.edit(user, comment)){

      // decrement post comment count and remove user ID from post
      Posts.update(comment.postId, {
        $inc:   {commentCount: -1},
        $pull:  {commenters: comment.userId}
      });

      // decrement user comment count and remove comment ID from user
      Meteor.users.update({_id: comment.userId}, {
        $inc:   {'telescope.commentCount': -1}
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
