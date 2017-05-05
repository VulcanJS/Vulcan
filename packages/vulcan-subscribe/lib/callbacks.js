import { createNotification } from 'meteor/vulcan:notifications';
import Users from 'meteor/vulcan:users';
import { addCallback } from 'meteor/vulcan:core';

// TODO: don't import these callbacks server-side (reduce bundle size of what's sent to the client)
// note: even if all these callbacks are async, they are imported on the client so they pop in the cheatsheet when debug is enabled

// note: leverage weak dependencies on packages
const Comments = Package['vulcan:comments'] ? Package['vulcan:comments'].default : null;
const Posts = Package['vulcan:posts'] ? Package['vulcan:posts'].default : null;
const Categories = Package['vulcan:categories'] ? Package['vulcan:categories'].default : null;

/**
 * @summary Notify users subscribed to 'another user' whenever another user posts
 */
function SubscribedCategoriesNotifications (post) {

  if (Meteor.isServer && !!post.categories && !!post.categories.length) {
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
      let subscriberIdsToNotify = _.uniq(_.difference(subscribers, userIdsNotified, [post.userId]));
      
      createNotification(subscriberIdsToNotify, 'newPost', notificationData);

      userIdsNotified = userIdsNotified.concat(subscriberIdsToNotify);
    }
  }
}

/**
 * @summary Notify users subscribed to the comment's thread
 */
function SubscribedPostNotifications (comment) {
    // note: dummy content has disableNotifications set to true
  if (Meteor.isServer && !comment.disableNotifications) {

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
      createNotification(subscriberIdsToNotify, 'newCommentSubscribed', notificationData);

      userIdsNotified = userIdsNotified.concat(subscriberIdsToNotify);
    }
  }
}

/**
 * @summary Notify users subscribed to 'another user' whenever another user posts
 */
function SubscribedUsersNotifications (post) {
  if (Meteor.isServer) {

    let userIdsNotified = [];
    const notificationData = {
      post: _.pick(post, '_id', 'userId', 'title', 'url', 'author')
    };

    const user = Users.findOne({_id: post.userId});

    if (!!user.subscribers && !!user.subscribers.length) {
      // remove userIds of users that have already been notified and of post's author 
      let subscriberIdsToNotify = _.difference(user.subscribers, userIdsNotified, [user._id]);
      
      createNotification(subscriberIdsToNotify, 'newPost', notificationData);

      userIdsNotified = userIdsNotified.concat(subscriberIdsToNotify);
    }
  }
}

if (!!Posts && !!Comments) {
  addCallback("comments.new.async", SubscribedPostNotifications);
}

if (!!Posts) {
  addCallback("posts.new.async", SubscribedUsersNotifications);
}

if (!!Posts && !!Categories) {
  addCallback("posts.new.async", SubscribedCategoriesNotifications);
}
