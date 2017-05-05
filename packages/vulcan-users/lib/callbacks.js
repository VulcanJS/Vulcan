import Users from './collection.js';
import marked from 'marked';
import { addCallback, Utils, runCallbacksAsync } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet

//////////////////////////////////////////////////////
// Callbacks                                        //
//////////////////////////////////////////////////////

/**
 * @summary Set up user object on creation
 * @param {Object} user – the user object being iterated on and returned
 * @param {Object} options – user options
 */
function setupUser (user, options) {

  const schema = Users.simpleSchema()._schema;

  // ------------------------------ Properties ------------------------------ //
  user.profile = options.profile || {};

  // run onInsert step
  _.keys(schema).forEach(fieldName => {
    // if schema has onInsert defined, run autovalue on user and options
    if (!user[fieldName] && schema[fieldName].onInsert) {
      const autoValue = schema[fieldName].onInsert(user, options);
      if (autoValue) {
        user[fieldName] = autoValue;
      }
    // otherwise, check whether options field has schema fields and extend the userObject
    } else if (!user[fieldName] && schema[fieldName] && options[fieldName]) {
      user[fieldName] = options[fieldName];
    }
  });

  return user;
}
addCallback("users.new.sync", setupUser);

/**
 * @summary Copy over profile.isDummy to isDummy on user creation
 * @param {Object} user – the user object being iterated on and returned
 * @param {Object} options – user options
 */
function copyDummyProperty (user, options) {
  if (typeof user.profile.isDummy !== "undefined") {
    user.isDummy = user.profile.isDummy;
  }
  return user;
}
addCallback("users.new.sync", copyDummyProperty);


function hasCompletedProfile (user) {
  return Users.hasCompletedProfile(user);
}
addCallback("users.profileCompleted.sync", hasCompletedProfile);

// remove this to get rid of dependency on vulcan:email

// function usersNewAdminUserCreationNotification (user) {
//   // send notifications to admins
//   const admins = Users.adminUsers();
//   admins.forEach(function(admin) {
//     if (Users.getSetting(admin, "notifications_users", false)) {
//       const emailProperties = Users.getNotificationProperties(user);
//       const html = VulcanEmail.getTemplate('newUser')(emailProperties);
//       VulcanEmail.send(Users.getEmail(admin), `New user account: ${emailProperties.displayName}`, VulcanEmail.buildTemplate(html));
//     }
//   });
//   return user;
// }
// addCallback("users.new.sync", usersNewAdminUserCreationNotification);

function usersEditGenerateHtmlBio (modifier) {
  if (modifier.$set && modifier.$set.bio) {
    modifier.$set.htmlBio = Utils.sanitize(marked(modifier.$set.bio));
  }
  return modifier;
}
addCallback("users.edit.sync", usersEditGenerateHtmlBio);

function usersEditCheckEmail (modifier, user) {
  // if email is being modified, update user.emails too
  if (modifier.$set && modifier.$set.email) {

    const newEmail = modifier.$set.email;

    // check for existing emails and throw error if necessary
    const userWithSameEmail = Users.findByEmail(newEmail);
    if (userWithSameEmail && userWithSameEmail._id !== user._id) {
      throw new Error(Utils.encodeIntlError({id:"users.email_already_taken", value: newEmail}));
    }

    // if user.emails exists, change it too
    if (!!user.emails) {
      user.emails[0].address = newEmail;
      modifier.$set.emails = user.emails;
    }

    // update email hash
    modifier.$set.emailHash = Users.avatar.hash(newEmail);

  }
  return modifier;
}
addCallback("users.edit.sync", usersEditCheckEmail);

// when a user is edited, check if their profile is now complete
function usersCheckCompletion (newUser, oldUser) {
  if (!Users.hasCompletedProfile(oldUser) && Users.hasCompletedProfile(newUser)) {
    runCallbacksAsync("users.profileCompleted.async", newUser);
  }
}
addCallback("users.edit.async", usersCheckCompletion);
