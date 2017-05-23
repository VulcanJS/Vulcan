import Users from './collection.js';
import marked from 'marked';
import { addCallback, Utils, runCallbacksAsync } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet

//////////////////////////////////////////////////////
// Callbacks                                        //
//////////////////////////////////////////////////////

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

