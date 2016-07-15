import Users from './collection.js';
import marked from 'marked';
import Events from "meteor/nova:events";
import NovaEmail from 'meteor/nova:email';

//////////////////////////////////////////////////////
// Collection Hooks                                 //
//////////////////////////////////////////////////////

/**
 * @summary Generate HTML body from Markdown on user bio insert
 */
Users.after.insert(function (userId, user) {

  // run create user async callbacks
  Telescope.callbacks.runAsync("onCreateUserAsync", user);

  // check if all required fields have been filled in. If so, run profile completion callbacks
  if (Users.hasCompletedProfile(user)) {
    Telescope.callbacks.runAsync("profileCompletedAsync", user);
  }

});

/**
 * @summary Generate HTML body from Markdown when user bio is updated
 */
Users.before.update(function (userId, doc, fieldNames, modifier) {
  // if bio is being modified, update htmlBio too
  if (Meteor.isServer && modifier.$set && modifier.$set["telescope.bio"]) {
    modifier.$set["telescope.htmlBio"] = Telescope.utils.sanitize(marked(modifier.$set["telescope.bio"]));
  }
});

/**
 * @summary Disallow $rename
 */
Users.before.update(function (userId, doc, fieldNames, modifier) {
  if (!!modifier.$rename) {
    throw new Meteor.Error("illegal $rename operator detected!");
  }
});

/**
 * @summary If user.telescope.email has changed, check for existing emails and change user.emails and email hash if needed
 */
 if (Meteor.isServer) {
  Users.before.update(function (userId, doc, fieldNames, modifier) {

    var user = doc;

    // if email is being modified, update user.emails too
    if (Meteor.isServer && modifier.$set && modifier.$set["telescope.email"]) {

      var newEmail = modifier.$set["telescope.email"];

      // check for existing emails and throw error if necessary
      var userWithSameEmail = Users.findByEmail(newEmail);
      if (userWithSameEmail && userWithSameEmail._id !== doc._id) {
        throw new Meteor.Error("email_taken2", "this_email_is_already_taken" + " (" + newEmail + ")");
      }

      // if user.emails exists, change it too
      if (!!user.emails) {
        user.emails[0].address = newEmail;
        modifier.$set.emails = user.emails;
      }

      // update email hash
      modifier.$set["telescope.emailHash"] = Gravatar.hash(newEmail);

    }
  });
}

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

  // look in a few places for the user email
  if (options.email) {
    user.telescope.email = options.email;
  } else if (user.services['meteor-developer'] && user.services['meteor-developer'].emails) {
    user.telescope.email = _.findWhere(user.services['meteor-developer'].emails, { primary: true }).address;
  } else if (user.services.facebook && user.services.facebook.email) {
    user.telescope.email = user.services.facebook.email;
  } else if (user.services.github && user.services.github.email) {
    user.telescope.email = user.services.github.email;
  } else if (user.services.google && user.services.google.email) {
    user.telescope.email = user.services.google.email;
  }

  // generate email hash
  if (!!user.telescope.email) {
    user.telescope.emailHash = Gravatar.hash(user.telescope.email);
  }

  // look in a few places for the displayName
  if (user.profile.username) {
    user.telescope.displayName = user.profile.username;
  } else if (user.profile.name) {
    user.telescope.displayName = user.profile.name;
  } else {
    user.telescope.displayName = user.username;
  }

  // create slug from display name
  user.telescope.slug = Telescope.utils.slugify(user.telescope.displayName);

  // if this is not a dummy account, and is the first user ever, make them an admin
  user.isAdmin = (!user.profile.isDummy && Meteor.users.find({'profile.isDummy': {$ne: true}}).count() === 0) ? true : false;

  Events.track('new user', {username: user.username, email: user.telescope.email});

  return user;
}
Telescope.callbacks.add("onCreateUser", setupUser);


function hasCompletedProfile (user) {
  return Users.hasCompletedProfile(user);
}
Telescope.callbacks.add("profileCompletedChecks", hasCompletedProfile);

function adminUserCreationNotification (user) {
  // send notifications to admins
  var admins = Users.adminUsers();
  admins.forEach(function(admin){
    if (Users.getSetting(admin, "notifications_users", false)) {
      var emailProperties = {
        profileUrl: Users.getProfileUrl(user, true),
        username: Users.getUserName(user)
      };
      var html = NovaEmail.getTemplate('newUser')(emailProperties);
      NovaEmail.send(Users.getEmail(admin), 'New user account: '+Users.getUserName(user), NovaEmail.buildTemplate(html));
    }
  });
  return user;
}
Telescope.callbacks.add("onCreateUser", adminUserCreationNotification);
