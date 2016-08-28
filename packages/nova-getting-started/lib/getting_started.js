import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import Comments from "meteor/nova:comments";
import Users from 'meteor/nova:users';

Users.addField({
  fieldName: 'telescope.isDummy',
  fieldSchema: {
    type: Boolean,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Posts.addField({
  fieldName: 'dummySlug',
  fieldSchema: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Posts.addField({
  fieldName: 'isDummy',
  fieldSchema: {
    type: Boolean,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Comments.addField({
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
 * @summary Copy over profile.isDummy to telescope.isDummy on user creation
 * @param {Object} user – the user object being iterated on and returned
 * @param {Object} options – user options
 */
function copyDummyProperty (user, options) {
  if (typeof user.profile.isDummy !== "undefined") {
    user.telescope.isDummy = user.profile.isDummy;
  }
  return user;
}
Telescope.callbacks.add("onCreateUser", copyDummyProperty);