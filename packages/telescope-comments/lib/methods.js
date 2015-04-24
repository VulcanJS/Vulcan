
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
    author: Users.getDisplayNameById(userId)
  };

  comment = _.extend(defaultProperties, comment);

  // ------------------------------ Callbacks ------------------------------ //

  // run all post submit server callbacks on comment object successively
  comment = Telescope.runCallbacks("commentSubmit", comment);

  // -------------------------------- Insert -------------------------------- //

  comment._id = Comments.insert(comment);

  // --------------------- Server-side Async Callbacks --------------------- //

  // run all post submit server callbacks on comment object successively
  Telescope.runCallbacks("commentSubmitAsync", comment, true);

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
        hasAdminRights = Users.isAdmin(user);

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
    if(Users.can.edit(Meteor.user(), comment)){
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
