import { addCallback, getActions } from 'meteor/vulcan:lib';

/*
  
  Core callbacks 
  
*/

/**
 * @summary Clear flash messages marked as seen when the route changes
 * @param {Object} Item needed by `runCallbacks` to iterate on, unused here
 * @param {Object} Redux store reference instantiated on the current connected client
 * @param {Object} Apollo Client reference instantiated on the current connected client
 */
function RouterClearMessages(unusedItem, store, apolloClient) {
  store.dispatch(getActions().messages.clearSeen());
  
  return unusedItem;
}

addCallback('router.onUpdate', RouterClearMessages);
