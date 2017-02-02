import { addCallback, getSetting } from 'meteor/nova:core';
import { sendGoogleAnalyticsRequest, mutationAnalyticsAsync } from './helpers';
import Analytics from 'analytics-node';

// add client-side callback: log a ga request on page view
addCallback('router.onUpdate', sendGoogleAnalyticsRequest);


// get the segment write key from the settings
const useSegment = getSetting('useSegment');
const writeKey = getSetting('segmentWriteKey');

// the settings obviously tells to use segment
// and segment write key is defined & isn't the placeholder from sample_settings.json
if (useSegment && writeKey && writeKey !== '456bar') {
  const analyticsInstance = new Analytics(writeKey);
  
  // generate callbacks on collection ...
  ['users', 'posts', 'comments', 'categories'].map(collection => {
    // ... for each common mutation
    return ['new', 'edit', 'remove'].map(mutation => {
      
      const hook = `${collection}.${mutation}`;
      
      addCallback(`${hook}.async`, function AnalyticsTracking(...args) {
        
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
        
        return mutationAnalyticsAsync(analyticsInstance, hook, document, currentUser);
      });
      
      // return the hook name, used for debug
      return hook;
    });
  });  
}
