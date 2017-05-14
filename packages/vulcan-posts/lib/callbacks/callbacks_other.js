import Posts from '../collection.js'
import Users from 'meteor/vulcan:users';
import { addCallback, getSetting } from 'meteor/vulcan:core';
import Events from 'meteor/vulcan:events';

// ------------------------------------- posts.remove.sync -------------------------------- //

function PostsRemoveOperations (post) {
  Users.update({_id: post.userId}, {$inc: {"postCount": -1}});
}
addCallback("posts.remove.sync", PostsRemoveOperations);

// ------------------------------------- posts.approve.async -------------------------------- //

/**
 * @summary set postedAt when a post is approved
 */
function PostsSetPostedAt (modifier, post) {
  modifier.$set.postedAt = new Date();
  return modifier;
}
addCallback("posts.approve.sync", PostsSetPostedAt);


// ------------------------------------- users.remove.async -------------------------------- //

function UsersRemoveDeletePosts (user, options) {
  if (options.deletePosts) {
    Posts.remove({userId: user._id});
  } else {
    // not sure if anything should be done in that scenario yet
    // Posts.update({userId: userId}, {$set: {author: "\[deleted\]"}}, {multi: true});
  }
}
addCallback("users.remove.async", UsersRemoveDeletePosts);


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