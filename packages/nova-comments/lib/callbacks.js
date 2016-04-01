//////////////////////////////////////////////////////
// Collection Hooks                                 //
//////////////////////////////////////////////////////

Comments.before.insert(function (userId, doc) {
  // note: only actually sanitizes on the server
  doc.htmlBody = Telescope.utils.sanitize(marked(doc.body));
});

Comments.before.update(function (userId, doc, fieldNames, modifier) {
  // if body is being modified, update htmlBody too
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {
    modifier.$set = modifier.$set || {};
    modifier.$set.htmlBody = Telescope.utils.sanitize(marked(modifier.$set.body));
  }
});

/**
 * Disallow $rename
 */
Comments.before.update(function (userId, doc, fieldNames, modifier) {
  if (!!modifier.$rename) {
    throw new Meteor.Error("illegal $rename operator detected!");
  }
});

//////////////////////////////////////////////////////
// Callbacks                                        //
//////////////////////////////////////////////////////

function afterCommentOperations (comment) {

  var userId = comment.userId;

  // increment comment count
  Meteor.users.update({_id: userId}, {
    $inc:       {'telescope.commentCount': 1}
  });

  // update post
  Posts.update(comment.postId, {
    $inc:       {commentCount: 1},
    $set:       {lastCommentedAt: new Date()},
    $addToSet:  {commenters: userId}
  });

  return comment;
}
Telescope.callbacks.add("comments.new.sync", afterCommentOperations);

// ------------------------------------- Votes -------------------------------- //

if (typeof Telescope.operateOnItem !== "undefined") {
  
  function upvoteOwnComment (comment) {

    var commentAuthor = Meteor.users.findOne(comment.userId);

    // upvote comment
    Telescope.operateOnItem(Comments, comment._id, commentAuthor, "upvote");

    return comment;
  }
  Telescope.callbacks.add("comments.new.sync", upvoteOwnComment);

}
// ------------------------------------- Notifications -------------------------------- //


if (typeof Telescope.notifications !== "undefined") {

  // add new comment notification callback on comment submit
  function commentSubmitNotifications (comment) {

    // note: dummy content has disableNotifications set to true
    if(Meteor.isServer && !comment.disableNotifications){

      var post = Posts.findOne(comment.postId),
          postAuthor = Users.findOne(post.userId),
          userIdsNotified = [],
          notificationData = {
            comment: _.pick(comment, '_id', 'userId', 'author', 'htmlBody'),
            post: _.pick(post, '_id', 'userId', 'title', 'url')
          };


      // 1. Notify author of post (if they have new comment notifications turned on)
      //    but do not notify author of post if they're the ones posting the comment
      if (Users.getSetting(postAuthor, "notifications_comments", true) && comment.userId !== postAuthor._id) {
        Telescope.createNotification(post.userId, 'newComment', notificationData);
        userIdsNotified.push(post.userId);
      }

      // 2. Notify author of comment being replied to
      if (!!comment.parentCommentId) {

        var parentComment = Comments.findOne(comment.parentCommentId);

        // do not notify author of parent comment if they're also post author or comment author
        // (someone could be replying to their own comment)
        if (parentComment.userId !== post.userId && parentComment.userId !== comment.userId) {

          var parentCommentAuthor = Users.findOne(parentComment.userId);

          // do not notify parent comment author if they have reply notifications turned off
          if (Users.getSetting(parentCommentAuthor, "notifications_replies", true)) {

            // add parent comment to notification data
            notificationData.parentComment = _.pick(parentComment, '_id', 'userId', 'author', 'htmlBody');

            Telescope.createNotification(parentComment.userId, 'newReply', notificationData);
            userIdsNotified.push(parentComment.userId);
          }
        }

      }

      // 3. Notify users subscribed to the thread
      // TODO: ideally this would be injected from the telescope-subscribe-to-posts package
      if (!!post.subscribers) {

        // remove userIds of users that have already been notified
        // and of comment author (they could be replying in a thread they're subscribed to)
        var subscriberIdsToNotify = _.difference(post.subscribers, userIdsNotified, [comment.userId]);
        Telescope.createNotification(subscriberIdsToNotify, 'newCommentSubscribed', notificationData);

        userIdsNotified = userIdsNotified.concat(subscriberIdsToNotify);

      }

    }
  }
  Telescope.callbacks.add("commentSubmitAsync", commentSubmitNotifications);

}