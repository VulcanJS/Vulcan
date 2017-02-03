import marked from 'marked';
import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import Comments from '../collection.js';
import Users from 'meteor/nova:users';
import { addCallback, Utils, getSetting } from 'meteor/nova:core';

// ------------------------------------- comments.new.validate -------------------------------- //

function CommentsNewRateLimit (comment, user) {
  if (!Users.isAdmin(user)) {
    const timeSinceLastComment = Users.timeSinceLast(user, Comments);
    const commentInterval = Math.abs(parseInt(getSetting('commentInterval',15)));

    // check that user waits more than 15 seconds between comments
    if((timeSinceLastComment < commentInterval)) {
      throw new Error(Utils.encodeIntlError({id: "comments.rate_limit_error", value: commentInterval-timeSinceLastComment}));
    }
  }
  return comment;
}
addCallback("comments.new.validate", CommentsNewRateLimit);

// ------------------------------------- comments.new.sync -------------------------------- //

function CommentsNewGenerateHTMLBody (comment, user) {
  comment.htmlBody = Utils.sanitize(marked(comment.body));
  return comment;
}
addCallback("comments.new.sync", CommentsNewGenerateHTMLBody);

function CommentsNewOperations (comment) {

  var userId = comment.userId;

  // increment comment count
  Users.update({_id: userId}, {
    $inc:       {'commentCount': 1}
  });

  // update post
  Posts.update(comment.postId, {
    $inc:       {commentCount: 1},
    $set:       {lastCommentedAt: new Date()},
    $addToSet:  {commenters: userId}
  });

  return comment;
}
addCallback("comments.new.sync", CommentsNewOperations);

// ------------------------------------- comments.new.async -------------------------------- //

// add new comment notification callback on comment submit
function CommentsNewNotifications (comment) {

  if (typeof Telescope.notifications !== "undefined" && !comment.isDummy) {

    // note: dummy content has disableNotifications set to true
    if(Meteor.isServer && !comment.disableNotifications){

      var post = Posts.findOne(comment.postId),
          postAuthor = Users.findOne(post.userId),
          userIdsNotified = [],
          notificationData = {
            comment: _.pick(comment, '_id', 'userId', 'author', 'htmlBody', 'postId'),
            post: _.pick(post, '_id', 'userId', 'title', 'url')
          };


      // 1. Notify author of post (if they have new comment notifications turned on)
      //    but do not notify author of post if they're the ones posting the comment
      if (Users.getSetting(postAuthor, "notifications_comments", true) && comment.userId !== postAuthor._id) {
        Telescope.notifications.create(post.userId, 'newComment', notificationData);
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

            Telescope.notifications.create(parentComment.userId, 'newReply', notificationData);
            userIdsNotified.push(parentComment.userId);
          }
        }

      }
      
    }
  }
}
addCallback("comments.new.async", CommentsNewNotifications);
