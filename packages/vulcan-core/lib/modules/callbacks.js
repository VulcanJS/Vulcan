import { addCallback } from 'meteor/vulcan:lib';

/*

  Core callbacks

*/

/**
 * @summary Clear flash messages marked as seen when the route changes
 * @param {Object} props
 * @param {Object} props.client Apollo Client reference instantiated on the current connected client
 */
function RouterClearMessages(unusedItem, nextRoute, store, apolloClient) {
  // TODO Apollo2: clear error messages on route change
  // store.dispatch(getActions().messages.clearSeen());
  // return unusedItem;
}

addCallback('router.onUpdate.async', RouterClearMessages);
