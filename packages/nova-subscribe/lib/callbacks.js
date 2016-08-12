import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

// Notify users subscribed to the thread
const SubscribedCommentsNotifications = (comment) => {
  if (typeof Telescope.notifications !== "undefined") {
    // note: dummy content has disableNotifications set to true
    if(Meteor.isServer && !comment.disableNotifications){

      const post = Posts.findOne(comment.postId);

      let userIdsNotified = [],
          notificationData = {
            comment: _.pick(comment, '_id', 'userId', 'author', 'htmlBody', 'postId'),
            post: _.pick(post, '_id', 'userId', 'title', 'url')
          };

      if (!!post.subscribers && !!post.subscribers.length) {
        // remove userIds of users that have already been notified
        // and of comment author (they could be replying in a thread they're subscribed to)
        let subscriberIdsToNotify = _.difference(post.subscribers, userIdsNotified, [comment.userId]);
        Telescope.notifications.create(subscriberIdsToNotify, 'newCommentSubscribed', notificationData);

        userIdsNotified = userIdsNotified.concat(subscriberIdsToNotify);
      }

    }
  }
}

Telescope.callbacks.add("comments.new.async", SubscribedCommentsNotifications);

/**
 * @summary Add new post notification callback on post submit
 */
function SubscribedUsersNotifications (post) {

  if (typeof Telescope.notifications !== "undefined") {
    if(Meteor.isServer) {

      let userIdsNotified = [];
      const notificationData = {
        post: _.pick(post, '_id', 'userId', 'title', 'url', 'author')
      };

      const user = Users.findOne({_id: post.userId});

      if (!!user.telescope.subscribers && !!user.telescope.subscribers.length) {
        // remove userIds of users that have already been notified and of post's author 
        let subscriberIdsToNotify = _.difference(user.telescope.subscribers, userIdsNotified, [user._id]);
        
        Telescope.notifications.create(subscriberIdsToNotify, 'newPost', notificationData);

        userIdsNotified = userIdsNotified.concat(subscriberIdsToNotify);
      }
    }
  }
}

Telescope.callbacks.add("posts.new.async", SubscribedUsersNotifications);
