import { addCallback, getActions } from 'meteor/vulcan:lib';

/*

  Core callbacks

*/

/**
 * @summary Clear flash messages marked as seen when the route changes
 * @param {Object} props
 * @param {Object} props.client Apollo Client reference instantiated on the current connected client
 */
function RouterClearMessages({ client }) {
  client.store.dispatch(getActions().messages.clearSeen());
}

addCallback('router.onUpdate.async', RouterClearMessages);
