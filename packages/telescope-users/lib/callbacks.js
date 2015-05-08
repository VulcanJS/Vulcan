/**
 * Set up user object on creation
 * @param {Object} user – the user object being iterated on and returned
 * @param {Object} options – user options
 */
function setupUser (user, options) {
  // ------------------------------ Properties ------------------------------ //
  var userProperties = {
    profile: options.profile || {},
    telescope: {
      karma: 0,
      isInvited: false,
      postCount: 0,
      commentCount: 0,
      invitedCount: 0,
      upvotedPosts: [],
      downvotedPosts: [],
      upvotedComments: [],
      downvotedComments: []
    }
  };
  user = _.extend(user, userProperties);

  // set email on user.telescope, and use it to generate email hash
  if (options.email) {
    user.telescope.email = options.email;
    user.telescope.emailHash = Gravatar.hash(options.email);
  }

  // set displayName on telescope
  user.telescope.displayName = user.username;

  // create slug from username
  user.telescope.slug = Telescope.utils.slugify(user.username);

  // if this is not a dummy account, and is the first user ever, make them an admin
  user.isAdmin = (!user.profile.isDummy && Meteor.users.find({'profile.isDummy': {$ne: true}}).count() === 0) ? true : false;

  Events.track('new user', {username: user.username, email: user.profile.email});

  return user;
}
Telescope.callbacks.register("onCreateUser", setupUser);


/**
 * Check if the user has completed their profile with an email and username.
 * @param {Object} user
 */
function hasCompletedProfile (user) {
  return !!Users.getEmail(user) && !!Users.getUserName(user);
}
Telescope.callbacks.register("profileCompletedChecks", hasCompletedProfile);
