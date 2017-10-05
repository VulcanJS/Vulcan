/*

Callbacks to:

- Increment a user's post count
- Run post approved callbacks
- Update a user's post count
- Remove a user's posts when it's deleted
- Track clicks

*/

import { Posts } from '../../../modules/posts/index.js'
import Users from 'meteor/vulcan:users';
import { addCallback, getSetting, registerSetting, runCallbacks, runCallbacksAsync } from 'meteor/vulcan:core';
import Events from 'meteor/vulcan:events';

registerSetting('forum.trackClickEvents', true, 'Track clicks to posts pages');

/**
 * @summary Increment the user's post count
 */
function PostsNewIncrementPostCount (post) {
  var userId = post.userId;
  Users.update({_id: userId}, {$inc: {'postCount': 1}});
}
addCallback('posts.new.async', PostsNewIncrementPostCount);

//////////////////////////////////////////////////////
// posts.edit.sync                                  //
//////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////
// posts.remove.sync                                //
//////////////////////////////////////////////////////

function PostsRemoveOperations (post) {
  Users.update({_id: post.userId}, {$inc: {'postCount': -1}});
  return post;
}
addCallback('posts.remove.sync', PostsRemoveOperations);

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

  if (getSetting('forum.trackClickEvents', true)) {
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