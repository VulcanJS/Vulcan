import { addCallback } from 'meteor/nova:core';
import Posts from 'meteor/nova:posts';
import Events from './collection.js';
import { sendGoogleAnalyticsRequest, requestAnalyticsAsync } from './helpers';

// add client-side callback: log a ga request on page view
addCallback('router.onUpdate', sendGoogleAnalyticsRequest);

  
// generate callbacks on collection for each common mutation
['users', 'posts', 'comments', 'categories'].map(collection => {
  
  return ['new', 'edit', 'remove'].map(mutation => {
    
    const hook = `${collection}.${mutation}`;
    
    addCallback(`${hook}.async`, function MutationAnalyticsTracking(...args) {
      
      // a note on what's happenning below:
      // the first argument is always the document we are interested in
      // the second to last argument is always the current user
      // on edit.async, the argument on index 1 is always the previous document
      // see nova:lib/mutations.js for more informations
      
      // remove unnecessary 'previousDocument' if operating on a collection.edit hook
      if (hook.includes('edit')) {
        args.splice(1,1);
      }
      
      const [document, currentUser, ...rest] = args; // eslint-disable-line no-unused-vars
      
      return requestAnalyticsAsync(hook, document, currentUser);
    });
    
    // return the hook name, used for debug
    return hook;
  });
});  

// generate callbacks on voting operations
['upvote', 'cancelUpvote', 'downvote', 'cancelDownvote'].map(operation => {
  
  addCallback(`${operation}.async`, function OperationTracking(...args) {
    
    const [document, currentUser, ...rest] = args; // eslint-disable-line no-unused-vars
    
    return requestAnalyticsAsync(operation, document, currentUser);
  });
});

// identify profile completion
addCallback(`users.profileCompleted.async`, function ProfileCompletedTracking(user) {
  return requestAnalyticsAsync('users.profileCompleted', user);
});


// /**
//  * @summary Increase the number of clicks on a post
//  * @param {string} postId – the ID of the post being edited
//  * @param {string} ip – the IP of the current user
//  */
Posts.increaseClicks = (postId, ip) => {
  const clickEvent = {
    name: 'click',
    properties: {
      postId: postId,
      ip: ip
    }
  };

  // make sure this IP hasn't previously clicked on this post
  const existingClickEvent = Events.findOne({name: 'click', 'properties.postId': postId, 'properties.ip': ip});

  if(!existingClickEvent) {
    Events.log(clickEvent);
    return Posts.update(postId, { $inc: { clickCount: 1 }}, {validate: false, bypassCollection2:true});
  }
};

// track links clicked, locally in Events collection
// note: this event is not sent to segment cause we cannot access the current user 
// in our server-side route /out -> sending an event would create a new anonymous 
// user: the free limit of 1,000 unique users per month would be reached quickly
addCallback(`posts.click.async`, function PostsClickTracking(postId, ip) {
  return Posts.increaseClicks(postId, ip);
});
