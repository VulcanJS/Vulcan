import { addCallback } from 'meteor/vulcan:core';
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
      // see vulcan:lib/mutations.js for more informations
      
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


