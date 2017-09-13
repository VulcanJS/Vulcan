import Posts from '../../../modules/posts/index.js'
import Users from 'meteor/vulcan:users';
import { addCallback, getSetting, runCallbacks, runCallbacksAsync } from 'meteor/vulcan:core';
import Events from 'meteor/vulcan:events';

/**
 * @summary Increment the user's post count
 */
function PostsNewIncrementPostCount (post) {
  var userId = post.userId;
  Users.update({_id: userId}, {$inc: {'postCount': 1}});
}
addCallback('posts.new.async', PostsNewIncrementPostCount);

/**
 * @summary Run the 'upvote.async' callbacks *once* the item exists in the database
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 */
function UpvoteAsyncCallbacksAfterDocumentInsert(item, user, collection) {
  runCallbacksAsync('upvote.async', item, user, collection, 'upvote');
}

addCallback('posts.new.async', UpvoteAsyncCallbacksAfterDocumentInsert);

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