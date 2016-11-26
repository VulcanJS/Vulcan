import Telescope from 'meteor/nova:lib';
import Users from './collection.js';
import marked from 'marked';
import Events from "meteor/nova:events";
import NovaEmail from 'meteor/nova:email';

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
    __karma: 0,
    __isInvited: false,
    __postCount: 0,
    __commentCount: 0,
    __invitedCount: 0,
    __upvotedPosts: [],
    __downvotedPosts: [],
    __upvotedComments: [],
    __downvotedComments: []
  };
  user = _.extend(user, userProperties);

  // look in a few places for the user email
  if (options.email) {
    user.__email = options.email;
  } else if (user.services['meteor-developer'] && user.services['meteor-developer'].emails) {
    user.__email = _.findWhere(user.services['meteor-developer'].emails, { primary: true }).address;
  } else if (user.services.facebook && user.services.facebook.email) {
    user.__email = user.services.facebook.email;
  } else if (user.services.github && user.services.github.email) {
    user.__email = user.services.github.email;
  } else if (user.services.google && user.services.google.email) {
    user.__email = user.services.google.email;
  } else if (user.services.linkedin && user.services.linkedin.emailAddress) {
    user.__email = user.services.linkedin.emailAddress;
  }

  // generate email hash
  if (!!user.__email) {
    user.__emailHash = Gravatar.hash(user.__email);
  }

  // look in a few places for the displayName
  if (user.profile.username) {
    user.__displayName = user.profile.username;
  } else if (user.profile.name) {
    user.__displayName = user.profile.name;
  } else if (user.services.linkedin && user.services.linkedin.firstName) {
    user.__displayName = user.services.linkedin.firstName + " " + user.services.linkedin.lastName;
  } else {
    user.__displayName = user.username;
  } 

  // create a basic slug from display name and then modify it if this slugs already exists;
  const basicSlug = Telescope.utils.slugify(user.__displayName);
  user.__slug = Telescope.utils.getUnusedSlug(Users, basicSlug);

  // if this is not a dummy account, and is the first user ever, make them an admin
  user.isAdmin = (!user.profile.isDummy && Users.find({'profile.isDummy': {$ne: true}}).count() === 0) ? true : false;

  Events.track('new user', {username: user.__displayName, email: user.__email});

  return user;
}
Telescope.callbacks.add("users.new.sync", setupUser);

function hasCompletedProfile (user) {
  return Users.hasCompletedProfile(user);
}
Telescope.callbacks.add("users.profileCompleted.sync", hasCompletedProfile);

function usersNewAdminUserCreationNotification (user) {
  // send notifications to admins
  const admins = Users.adminUsers();
  admins.forEach(function(admin) {
    if (Users.getSetting(admin, "notifications_users", false)) {
      const emailProperties = Users.getNotificationProperties(user);
      const html = NovaEmail.getTemplate('newUser')(emailProperties);
      NovaEmail.send(Users.getEmail(admin), `New user account: ${emailProperties.displayName}`, NovaEmail.buildTemplate(html));
    }
  });
  return user;
}
Telescope.callbacks.add("users.new.sync", usersNewAdminUserCreationNotification);

function usersEditGenerateHtmlBio (modifier) {
  if (modifier.$set && modifier.$set.__bio) {
    modifier.$set.__htmlBio = Telescope.utils.sanitize(marked(modifier.$set.__bio));
  }
  return modifier;
}
Telescope.callbacks.add("users.edit.sync", usersEditGenerateHtmlBio);

function usersEditCheckEmail (modifier, user) {
  // if email is being modified, update user.emails too
  if (modifier.$set && modifier.$set.__email) {

    var newEmail = modifier.$set.__email;

    // check for existing emails and throw error if necessary
    var userWithSameEmail = Users.findByEmail(newEmail);
    if (userWithSameEmail && userWithSameEmail._id !== user._id) {
      throw new Meteor.Error("email_taken2", "this_email_is_already_taken" + " (" + newEmail + ")");
    }

    // if user.emails exists, change it too
    if (!!user.emails) {
      user.emails[0].address = newEmail;
      modifier.$set.emails = user.emails;
    }

    // update email hash
    modifier.$set.__emailHash = Gravatar.hash(newEmail);

  }
  return modifier;
}
Telescope.callbacks.add("users.edit.sync", usersEditCheckEmail);
