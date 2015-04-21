/**
 * Users hooks namespace
 */

Users.hooks = {
  userEditRenderedCallbacks: [],
  userEditClientCallbacks: [],
  userCreatedCallbacks: [],
  userProfileCompleteChecks: []
}


/**
 * Check if the user has completed their profile with an email and username.
 * @param {Object} user
 */
Users.hooks.userProfileCompleteChecks.push(
  function(user) {
    return !!Users.getEmail(user) && !!Users.getUserName(user);
  }
);