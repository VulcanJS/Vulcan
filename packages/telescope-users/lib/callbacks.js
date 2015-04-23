/**
 * Users hooks namespace
 */

// Users.hooks = {
//   userEditRenderedCallbacks: [],
//   userEditClientCallbacks: [],
//   userCreatedCallbacks: [],
//   userProfileCompleteChecks: []
// }


/**
 * Check if the user has completed their profile with an email and username.
 * @param {Object} user
 */
function hasCompletedProfile (user) {
  return !!Users.getEmail(user) && !!Users.getUserName(user);
}
Telescope.registerCallback("profileCompletedChecks", hasCompletedProfile);