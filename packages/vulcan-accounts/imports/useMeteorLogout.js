import { useApolloClient } from '@apollo/client';

/**
 *  Hook used to sign the user out.
 *
 * @param {function} callback called after the logout and the Apollo store reset
 * @returns {function} a function to execute when you log the user out
 */

const useMeteorLogout = (callback = () => {}) => {
  const client = useApolloClient();
  return () =>
    Meteor.logout(() => {
      const resetStoreCallback = () => {
        callback();
        removeResetStoreCallback(resetStoreCallback);
      };
      const removeResetStoreCallback = client.onResetStore(resetStoreCallback);
      client.resetStore();
    });
};

export default useMeteorLogout;
