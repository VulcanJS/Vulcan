import Posts from '../collection.js'
import marked from 'marked';
import Users from 'meteor/vulcan:users';
import { addCallback, getSetting, Utils, runCallbacks, runCallbacksAsync } from 'meteor/vulcan:core';
import { createError } from 'apollo-errors';
import Events from 'meteor/vulcan:events';
import { createNotification } from '../email/notifications.js';

//////////////////////////////////////////////////////
// posts.new.validate                               //
//////////////////////////////////////////////////////

/**
 * @summary Rate limiting
 */
function PostsNewRateLimit (post, user) {

  if(!Users.isAdmin(user)){

    var timeSinceLastPost = Users.timeSinceLast(user, Posts),
      numberOfPostsInPast24Hours = Users.numberOfItemsInPast24Hours(user, Posts),
      postInterval = Math.abs(parseInt(getSetting('postInterval', 30))),
      maxPostsPer24Hours = Math.abs(parseInt(getSetting('maxPostsPerDay', 5)));

    // check that user waits more than X seconds between posts
    if(timeSinceLastPost < postInterval){
      const RateLimitError = createError('posts.rate_limit_error', {message: 'posts.rate_limit_error'});
      throw new RateLimitError({data: {break: true, value: postInterval-timeSinceLastPost}});
    }
    // check that the user doesn't post more than Y posts per day
    if(numberOfPostsInPast24Hours >= maxPostsPer24Hours){
      const RateLimitError = createError('posts.max_per_day', {message: 'posts.max_per_day'});
      throw new RateLimitError({data: {break: true, value: maxPostsPer24Hours}});
    }
  }

  return post;
}
addCallback('posts.new.validate', PostsNewRateLimit);

//////////////////////////////////////////////////////
// posts.new.sync                                   //
//////////////////////////////////////////////////////

/**
 * @summary Check for duplicate links
 */
function PostsNewDuplicateLinksCheck (post, user) {
  if(!!post.url && Posts.checkForSameUrl(post.url)) {
    const DuplicateError = createError('posts.link_already_posted', {message: 'posts.link_already_posted'});
    throw new DuplicateError({data: {break: true, url: post.url}});
  }
  return post;
}
addCallback('posts.new.sync', PostsNewDuplicateLinksCheck);

//////////////////////////////////////////////////////
// posts.new.async                                  //
//////////////////////////////////////////////////////

/**
 * @summary Increment the user's post count
 */
function PostsNewIncrementPostCount (post) {
  var userId = post.userId;
  Users.update({_id: userId}, {$inc: {'postCount': 1}});
}
addCallback('posts.new.async', PostsNewIncrementPostCount);

/**
 * @summary Add new post notification callback on post submit
 */
function PostsNewNotifications (post) {

  let adminIds = _.pluck(Users.adminUsers({fields: {_id:1}}), '_id');
  let notifiedUserIds = _.pluck(Users.find({'notifications_posts': true}, {fields: {_id:1}}).fetch(), '_id');

  // remove post author ID from arrays
  adminIds = _.without(adminIds, post.userId);
  notifiedUserIds = _.without(notifiedUserIds, post.userId);

  if (post.status === Posts.config.STATUS_PENDING && !!adminIds.length) {
    // if post is pending, only notify admins
    createNotification(adminIds, 'newPendingPost', {documentId: post._id});
  } else if (!!notifiedUserIds.length) {
    // if post is approved, notify everybody
    createNotification(notifiedUserIds, 'newPost', {documentId: post._id});
  }

}
addCallback("posts.new.async", PostsNewNotifications);

//////////////////////////////////////////////////////
// posts.edit.sync                                  //
//////////////////////////////////////////////////////

/**
 * @summary Check for duplicate links
 */
function PostsEditDuplicateLinksCheck (modifier, post) {
  if(post.url !== modifier.$set.url && !!modifier.$set.url) {
    Posts.checkForSameUrl(modifier.$set.url);
  }
  return modifier;
}
addCallback('posts.edit.sync', PostsEditDuplicateLinksCheck);

function PostsEditRunPostApprovedSyncCallbacks (modifier, post) {
  if (modifier.$set && Posts.isApproved(modifier.$set) && !Posts.isApproved(post)) {
    modifier = runCallbacks('posts.approve.sync', modifier, post);
  }
  return modifier;
}
addCallback('posts.edit.sync', PostsEditRunPostApprovedSyncCallbacks);

//////////////////////////////////////////////////////
// posts.edit.async                                 //
//////////////////////////////////////////////////////

function PostsEditRunPostApprovedAsyncCallbacks (post, oldPost) {
  if (Posts.isApproved(post) && !Posts.isApproved(oldPost)) {
    runCallbacksAsync('posts.approve.async', post);
  }
}
addCallback('posts.edit.async', PostsEditRunPostApprovedAsyncCallbacks);

/**
 * @summary Add notification callback when a post is approved
 */
function PostsApprovedNotification (post) {
  createNotification(post.userId, 'postApproved', {documentId: post._id});
}
addCallback("posts.approve.async", PostsApprovedNotification);

//////////////////////////////////////////////////////
// posts.remove.sync                                //
//////////////////////////////////////////////////////

function PostsRemoveOperations (post) {
  Users.update({_id: post.userId}, {$inc: {'postCount': -1}});
  return post;
}
addCallback('posts.remove.sync', PostsRemoveOperations);

//////////////////////////////////////////////////////
// posts.approve.sync                               //
//////////////////////////////////////////////////////

/**
 * @summary set postedAt when a post is approved and it doesn't have a postedAt date
 */
function PostsSetPostedAt (modifier, post) {
  if (!modifier.$set.postedAt && !post.postedAt) {
    modifier.$set.postedAt = new Date();
    if (modifier.$unset) {
      delete modifier.$unset.postedAt;
    }
  }
  return modifier;
}
addCallback('posts.approve.sync', PostsSetPostedAt);

//////////////////////////////////////////////////////
// users.remove.async                               //
//////////////////////////////////////////////////////

function UsersRemoveDeletePosts (user, options) {
  if (options.deletePosts) {
    Posts.remove({userId: user._id});
  } else {
    // not sure if anything should be done in that scenario yet
    // Posts.update({userId: userId}, {$set: {author: '\[deleted\]'}}, {multi: true});
  }
}
addCallback('users.remove.async', UsersRemoveDeletePosts);

//////////////////////////////////////////////////////
// posts.click.async                                //
//////////////////////////////////////////////////////

// /**
//  * @summary Increase the number of clicks on a post
//  * @param {string} postId – the ID of the post being edited
//  * @param {string} ip – the IP of the current user
//  */
Posts.increaseClicks = (post, ip) => {
  const clickEvent = {
    name: 'click',
    properties: {
      postId: post._id,
      ip: ip
    }
  };

  if (getSetting('trackClickEvents', true)) {
    // make sure this IP hasn't previously clicked on this post
    const existingClickEvent = Events.findOne({name: 'click', 'properties.postId': post._id, 'properties.ip': ip});

    if(!existingClickEvent) {
      Events.log(clickEvent);
      return Posts.update(post._id, { $inc: { clickCount: 1 }});
    }
  } else {
    return Posts.update(post._id, { $inc: { clickCount: 1 }});
  }
};

function PostsClickTracking(post, ip) {
  return Posts.increaseClicks(post, ip);
}

// track links clicked, locally in Events collection
// note: this event is not sent to segment cause we cannot access the current user 
// in our server-side route /out -> sending an event would create a new anonymous 
// user: the free limit of 1,000 unique users per month would be reached quickly
addCallback('posts.click.async', PostsClickTracking);