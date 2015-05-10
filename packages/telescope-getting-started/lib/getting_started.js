Users.registerField({
  fieldName: 'telescope.isDummy',
  fieldSchema: {
    type: Boolean,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Posts.registerField({
  fieldName: 'dummySlug',
  fieldSchema: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Posts.registerField({
  fieldName: 'isDummy',
  fieldSchema: {
    type: Boolean,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Comments.registerField({
fieldName: 'isDummy',
fieldSchema: {
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