import marked from 'marked';
import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import Comments from '../collection.js';
import Users from 'meteor/nova:users';
import { addCallback, Utils, getSetting } from 'meteor/nova:core';

// ------------------------------------- comments.new.validate -------------------------------- //

// function CommentsNewUserCheck (comment, user) {
//   // check that user can post
//   if (!user || !Users.canDo(user, "comments.new"))
//     throw new Meteor.Error(601, 'you_need_to_login_or_be_invited_to_post_new_comments');
//   return comment;
// }
// addCallback("comments.new.sync", CommentsNewUserCheck);

function CommentsNewRateLimit (comment, user) {
  if (!Users.isAdmin(user)) {
    const timeSinceLastComment = Users.timeSinceLast(user, Comments);
    const commentInterval = Math.abs(parseInt(getSetting('commentInterval',15)));
    // check that user waits more than 15 seconds between comments
    if((timeSinceLastComment < commentInterval)) {
      throw new Meteor.Error("CommentsNewRateLimit", "comments.rate_limit_error", commentInterval-timeSinceLastComment);
    }
  }
  return comment;
}
addCallback("comments.new.validate", CommentsNewRateLimit);

// function CommentsNewSubmittedPropertiesCheck (comment, user) {
//   // admin-only properties
//   // userId
//   const schema = Comments.simpleSchema()._schema;

//   // clear restricted properties
//   _.keys(comment).forEach(function (fieldName) {

//     // make an exception for postId, which should be setable but not modifiable
//     if (fieldName === "postId") {
//       // ok
//     } else {
//       var field = schema[fieldName];
//       if (!Users.canInsertField (user, field)) {
//         throw new Meteor.Error("disallowed_property", 'disallowed_property_detected' + ": " + fieldName);
//       }
//     }

//   });

//   // if no userId has been set, default to current user id
//   if (!comment.userId) {
//     comment.userId = user._id;
//   }
//   return comment;
// }
// addCallback("comments.new.validate", CommentsNewSubmittedPropertiesCheck);

// ------------------------------------- comments.new.sync -------------------------------- //

/**
 * @summary Check for required properties
 */
// function CommentsNewRequiredPropertiesCheck (comment, user) {

//   var userId = comment.userId; // at this stage, a userId is expected

//   // Don't allow empty comments
//   if (!comment.body)
//     throw new Meteor.Error(704, 'your_comment_is_empty');

//   var defaultProperties = {
//     createdAt: new Date(),
//     postedAt: new Date(),
//     upvotes: 0,
//     downvotes: 0,
//     baseScore: 0,
//     score: 0,
//     author: Users.getDisplayNameById(userId)
//   };

//   comment = _.extend(defaultProperties, comment);

//   return comment;
// }
// addCallback("comments.new.sync", CommentsNewRequiredPropertiesCheck);

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
