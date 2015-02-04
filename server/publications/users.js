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

// Publish all the users that have posted the currently displayed list of posts
// plus the commenters for each post

Meteor.publish('friendsWonders', function(slug) {
  var user = Meteor.users.findOne({slug: slug});
  if (typeof user.friendsIds === "undefined") {
    return [];
  }
  var selector =  {_id: {$in: user.friendsIds}} // only users that has friends
  if (typeof user.friendsWonders !== "undefined") {
    return Meteor.users.find(selector, {fields: {
      _id: true,
      'profile.name': true,
      'services.facebook.id': true,
      'services.facebook.name': true,
      slug: true
    }});
  }
  return [];
});

Meteor.publish('friendVotes', function(friendId) {
  var user = Meteor.users.findOne(friendId);
  var options = isAdminById(this.userId) ? {} : {fields: friendVotesOptions};
  if (user) {
    return Meteor.users.find({_id: user._id}, options);
  }
  return [];
});