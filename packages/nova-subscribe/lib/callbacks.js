import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';

// note: even if all these callbacks are async, they are imported on the client so they pop in the cheatsheet when debug is enabled

/**
 * @summary Notify users subscribed to the comment's thread
 */
 
if (typeof Package['nova:posts'] !== "undefined" && typeof Package['nova:comments'] !== "undefined") {
  import Posts from 'meteor/nova:posts';
  
  const SubscribedPostNotifications = (comment) => {
    // note: dummy content has disableNotifications set to true
    if (typeof Telescope.notifications !== "undefined" && Meteor.isServer && !comment.disableNotifications) {

      const post = Posts.findOne(comment.postId);

      let userIdsNotified = [];
      const notificationData = {
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
  };

  Telescope.callbacks.add("comments.new.async", SubscribedPostNotifications);
}

/**
 * @summary Notify users subscribed to 'another user' whenever another user posts
 */
if (typeof Package['nova:posts'] !== "undefined") {
  const SubscribedUsersNotifications = (post) => {
    if (typeof Telescope.notifications !== "undefined" && Meteor.isServer) {

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
  };

  Telescope.callbacks.add("posts.new.async", SubscribedUsersNotifications);
}

/**
 * @summary Notify users subscribed to 'another user' whenever another user posts
 */

 if (typeof Package['nova:posts'] !== "undefined" && typeof Package['nova:categories'] !== "undefined") {
  import Categories from 'meteor/nova:categories';

  const SubscribedCategoriesNotifications = (post) => {

    if (typeof Telescope.notifications !== "undefined" && Meteor.isServer && !!post.categories && !!post.categories.length) {
      // get the subscribers of the different categories from the post's categories
      const subscribers = post.categories
                                // find the category from its id
                                .map(categoryId => Categories.findOne({_id: categoryId}))
                                // clean the array if none subscribe to this category
                                .filter(category => typeof category.subscribers !== 'undefined' || !!category.subscribers)
                                // build the subscribers list interested in these categories
                                .reduce((subscribersList, category) => [...subscribersList, ...category.subscribers], []);

      let userIdsNotified = [];
      const notificationData = {
        post: _.pick(post, '_id', 'userId', 'title', 'url', 'author')
      };

      if (!!subscribers && !!subscribers.length) {
        // remove userIds of users that have already been notified and of post's author 
        let subscriberIdsToNotify = _.difference(subscribers, userIdsNotified, [post.userId]);
        
        Telescope.notifications.create(subscriberIdsToNotify, 'newPost', notificationData);

        userIdsNotified = userIdsNotified.concat(subscriberIdsToNotify);
      }
    }
  };

  Telescope.callbacks.add("posts.new.async", SubscribedCategoriesNotifications);
}
