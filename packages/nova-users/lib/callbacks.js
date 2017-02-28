import Users from './collection.js';
import marked from 'marked';
import { Gravatar } from 'meteor/jparker:gravatar';
import { addCallback, Utils, runCallbacksAsync } from 'meteor/nova:lib'; // import from nova:lib because nova:core isn't loaded yet

//////////////////////////////////////////////////////
// Callbacks                                        //
//////////////////////////////////////////////////////

/**
 * @summary Set up user object on creation
 * @param {Object} user – the user object being iterated on and returned
 * @param {Object} options – user options
 */
function setupUser (user, options) {
  // ------------------------------ Properties ------------------------------ //
  var userProperties = {
    profile: options.profile || {},
    karma: 0,
    isInvited: false,
    postCount: 0,
    commentCount: 0,
    invitedCount: 0,
    upvotedPosts: [],
    downvotedPosts: [],
    upvotedComments: [],
    downvotedComments: []
  };
  user = _.extend(user, userProperties);

  // look in a few places for the user email
  if (options.email) {
    user.email = options.email;
  } else if (user.services['meteor-developer'] && user.services['meteor-developer'].emails) {
    user.email = _.findWhere(user.services['meteor-developer'].emails, { primary: true }).address;
  } else if (user.services.facebook && user.services.facebook.email) {
    user.email = user.services.facebook.email;
  } else if (user.services.github && user.services.github.email) {
    user.email = user.services.github.email;
  } else if (user.services.google && user.services.google.email) {
    user.email = user.services.google.email;
  } else if (user.services.linkedin && user.services.linkedin.emailAddress) {
    user.email = user.services.linkedin.emailAddress;
  }

  // generate email hash
  if (!!user.email) {
    user.emailHash = Gravatar.hash(user.email);
  }

  // look in a few places for the displayName
  if (user.profile.username) {
    user.displayName = user.profile.username;
  } else if (user.profile.name) {
    user.displayName = user.profile.name;
  } else if (user.services.linkedin && user.services.linkedin.firstName) {
    user.displayName = user.services.linkedin.firstName + " " + user.services.linkedin.lastName;
  } else {
    user.displayName = user.username;
  }

  // add Twitter username
  if (user.services && user.services.twitter && user.services.twitter.screenName) {
    user.twitterUsername = user.services.twitter.screenName;
  }

  // create a basic slug from display name and then modify it if this slugs already exists;
  const basicSlug = Utils.slugify(user.displayName);
  user.slug = Utils.getUnusedSlug(Users, basicSlug);

  // if this is not a dummy account, and is the first user ever, make them an admin
  user.isAdmin = (!user.profile.isDummy && Users.find({'profile.isDummy': {$ne: true}}).count() === 0) ? true : false;

  // Events.track('new user', {username: user.displayName, email: user.email});

  return user;
}
addCallback("users.new.sync", setupUser);

function hasCompletedProfile (user) {
  return Users.hasCompletedProfile(user);
}
addCallback("users.profileCompleted.sync", hasCompletedProfile);

// remove this to get rid of dependency on nova:email

// function usersNewAdminUserCreationNotification (user) {
//   // send notifications to admins
//   const admins = Users.adminUsers();
//   admins.forEach(function(admin) {
//     if (Users.getSetting(admin, "notifications_users", false)) {
//       const emailProperties = Users.getNotificationProperties(user);
//       const html = NovaEmail.getTemplate('newUser')(emailProperties);
//       NovaEmail.send(Users.getEmail(admin), `New user account: ${emailProperties.displayName}`, NovaEmail.buildTemplate(html));
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
    modifier.$set.emailHash = Gravatar.hash(newEmail);

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

