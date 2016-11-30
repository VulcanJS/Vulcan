import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import Comments from "meteor/nova:comments";
import Users from 'meteor/nova:users';

Users.addField({
  fieldName: '__isDummy',
  fieldSchema: {
    type: Boolean,
    optional: true,
    hidden: true // never show this
  }
});

Posts.addField({
  fieldName: 'dummySlug',
  fieldSchema: {
    type: String,
    optional: true,
    hidden: true // never show this
  }
});

Posts.addField({
  fieldName: 'isDummy',
  fieldSchema: {
    type: Boolean,
    optional: true,
    hidden: true // never show this
  }
});

Comments.addField({
  fieldName: 'isDummy',
  fieldSchema: {
    type: Boolean,
    optional: true,
    hidden: true // never show this
  }
});

/**
 * @summary Copy over profile.isDummy to __isDummy on user creation
 * @param {Object} user – the user object being iterated on and returned
 * @param {Object} options – user options
 */
function copyDummyProperty (user, options) {
  if (typeof user.profile.__isDummy !== "undefined") {
    user.__isDummy = user.profile.__isDummy;
  }
  return user;
}
Telescope.callbacks.add("users.new.sync", copyDummyProperty);