Users.registerField({
  propertyName: 'telescope.isDummy',
  propertySchema: {
    type: Boolean,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Posts.registerField({
  propertyName: 'dummySlug',
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Posts.registerField({
  propertyName: 'isDummy',
  propertySchema: {
    type: Boolean,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Comments.registerField({
propertyName: 'isDummy',
propertySchema: {
  type: Boolean,
  optional: true,
  autoform: {
    omit: true
  }
}
});

/**
 * Copy over profile.isDummy to telescope.isDummy on user creation
 * @param {Object} user – the user object being iterated on and returned
 * @param {Object} options – user options
 */
function copyDummyProperty (user, options) {
  if (typeof user.profile.isDummy !== "undefined") {
    user.telescope.isDummy = user.profile.isDummy;
  }
  return user;
}
Telescope.callbacks.register("onCreateUser", copyDummyProperty);