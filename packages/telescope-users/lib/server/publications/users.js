// Publish the current user

Meteor.publish('currentUser', function() {
  var user = Meteor.users.find({_id: this.userId});
  return user;
});

// publish all users for admins to make autocomplete work
// TODO: find a better way

Meteor.publish('allUsersAdmin', function() {
  var selector = getSetting('requirePostInvite') ? {isInvited: true} : {}; // only users that can post
  if (isAdminById(this.userId)) {
    return Meteor.users.find(selector, {fields: {
      _id: true,
      profile: true,
      slug: true
    }});
  }
  return [];
});
