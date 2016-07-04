import marked from 'marked';
import Posts from "meteor/nova:posts";
import Comments from './collection.js';
import Users from 'meteor/nova:users';

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
 * @summary Disallow $rename
 */
Comments.before.update(function (userId, doc, fieldNames, modifier) {
  if (!!modifier.$rename) {
    throw new Meteor.Error("illegal $rename operator detected!");
  }
});

//////////////////////////////////////////////////////
// Callbacks                                        //
//////////////////////////////////////////////////////


/*

### comments.new.method

- CommentsNewUserCheck
- CommentsNewRateLimit
- CommentsNewSubmittedPropertiesCheck

### comments.new.sync

- CommentsNewRequiredPropertiesCheck

### comments.new.async

- CommentsNewOperations
- CommentsNewUpvoteOwnComment
- CommentsNewNotifications

### comments.edit.method

- CommentsEditUserCheck
- CommentsEditSubmittedPropertiesCheck

### comments.edit.sync

### comments.edit.async

### users.remove.async

- UsersRemoveDeleteComments

*/

// ------------------------------------- comments.new.method -------------------------------- //

function CommentsNewUserCheck (comment, user) {
  // check that user can post
  if (!user || !Users.can.comment(user))
    throw new Meteor.Error(601, __('you_need_to_login_or_be_invited_to_post_new_comments'));
  return comment;
}
Telescope.callbacks.add("comments.new.method", CommentsNewUserCheck);

function CommentsNewRateLimit (comment, user) {
  if (!Users.is.admin(user)) {
    var timeSinceLastComment = Users.timeSinceLast(user, Comments),
        commentInterval = Math.abs(parseInt(Telescope.settings.get('commentInterval',15)));
    // check that user waits more than 15 seconds between comments
    if((timeSinceLastComment < commentInterval)) {
      throw new Meteor.Error("CommentsNewRateLimit", "comments.rate_limit_error", commentInterval-timeSinceLastComment);
    }
  }
  return comment;
}
Telescope.callbacks.add("comments.new.method", CommentsNewRateLimit);

function CommentsNewSubmittedPropertiesCheck (comment, user) {
  // admin-only properties
  // userId
  const schema = Comments.simpleSchema()._schema;

  // clear restricted properties
  _.keys(comment).forEach(function (fieldName) {

    // make an exception for postId, which should be setable but not modifiable
    if (fieldName === "postId") {
      // ok
    } else {
      var field = schema[fieldName];
      if (!Users.can.submitField(user, field)) {
        throw new Meteor.Error("disallowed_property", __('disallowed_property_detected') + ": " + fieldName);
      }
    }

  });

  // if no userId has been set, default to current user id
  if (!comment.userId) {
    comment.userId = user._id;
  }
  return comment;
}
Telescope.callbacks.add("comments.new.method", CommentsNewSubmittedPropertiesCheck);

// ------------------------------------- comments.new.sync -------------------------------- //

/**
 * @summary Check for required properties
 */
function CommentsNewRequiredPropertiesCheck (comment, user) {
  
  var userId = comment.userId; // at this stage, a userId is expected

  // Don't allow empty comments
  if (!comment.body)
    throw new Meteor.Error(704, 'your_comment_is_empty');

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

  return comment;
}
Telescope.callbacks.add("comments.new.sync", CommentsNewRequiredPropertiesCheck);


// ------------------------------------- comments.new.async -------------------------------- //

function CommentsNewOperations (comment) {

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
Telescope.callbacks.add("comments.new.async", CommentsNewOperations);

function CommentsNewUpvoteOwnComment (comment) {

  if (typeof Telescope.operateOnItem !== "undefined") {

    var commentAuthor = Meteor.users.findOne(comment.userId);

    // upvote comment
    Telescope.operateOnItem(Comments, comment._id, commentAuthor, "upvote");

    return comment;
  }
}
Telescope.callbacks.add("comments.new.async", CommentsNewUpvoteOwnComment);

// add new comment notification callback on comment submit
function CommentsNewNotifications (comment) {

  if (typeof Telescope.notifications !== "undefined") {

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

      // 3. Notify users subscribed to the thread
      // TODO: ideally this would be injected from the telescope-subscribe-to-posts package
      if (!!post.subscribers) {

        // remove userIds of users that have already been notified
        // and of comment author (they could be replying in a thread they're subscribed to)
        var subscriberIdsToNotify = _.difference(post.subscribers, userIdsNotified, [comment.userId]);
        Telescope.notifications.create(subscriberIdsToNotify, 'newCommentSubscribed', notificationData);

        userIdsNotified = userIdsNotified.concat(subscriberIdsToNotify);

      }

    }
  }
}
Telescope.callbacks.add("comments.new.async", CommentsNewNotifications);

// ------------------------------------- comments.edit.method -------------------------------- //

function CommentsEditUserCheck (modifier, comment, user) {
  if (!user || !Users.can.edit(user, comment)) {
    throw new Meteor.Error(601, 'sorry_you_cannot_edit_this_comment');
  }
  return modifier;
}
Telescope.callbacks.add("comments.edit.method", CommentsEditUserCheck);

function CommentsEditSubmittedPropertiesCheck (modifier, comment, user) {
  const schema = Posts.simpleSchema()._schema;
  // go over each field and throw an error if it's not editable
  // loop over each operation ($set, $unset, etc.)
  _.each(modifier, function (operation) {
    // loop over each property being operated on
    _.keys(operation).forEach(function (fieldName) {

      var field = schema[fieldName];
      if (!Users.can.editField(user, field, comment)) {
        throw new Meteor.Error("disallowed_property", __('disallowed_property_detected') + ": " + fieldName);
      }

    });
  });
  return modifier;
}
Telescope.callbacks.add("comments.edit.method", CommentsEditSubmittedPropertiesCheck);


// ------------------------------------- comments.edit.sync -------------------------------- //

// ------------------------------------- comments.edit.async -------------------------------- //



// ------------------------------------- users.remove.async -------------------------------- //

function UsersRemoveDeleteComments (user, options) {
  if (options.deleteComments) {
    var deletedComments = Comments.remove({userId: userId});
  } else {
    // not sure if anything should be done in that scenario yet
    // Comments.update({userId: userId}, {$set: {author: "\[deleted\]"}}, {multi: true});
  }
}
Telescope.callbacks.add("users.remove.async", UsersRemoveDeleteComments);

// Add to posts.single publication

function PostsSingleAddCommentsUsers (users, post) {
  // get IDs from all commenters on the post
  const comments = Comments.find({postId: post._id}).fetch();
  if (comments.length) {
    users = users.concat(_.pluck(comments, "userId"));
  }
  return users;
}
Telescope.callbacks.add("posts.single.getUsers", PostsSingleAddCommentsUsers);
