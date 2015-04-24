
/**
 * Check if the user has completed their profile with an email and username.
 * @param {Object} user
 */
function hasCompletedProfile (user) {
  return !!Users.getEmail(user) && !!Users.getUserName(user);
}
Telescope.callbacks.register("profileCompletedChecks", hasCompletedProfile);