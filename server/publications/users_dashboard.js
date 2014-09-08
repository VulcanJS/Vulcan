// Publish all users

Meteor.publish('allUsers', function(filterBy, sortBy, limit) {
  if(isAdminById(this.userId)){
    var parameters = getUsersParameters(filterBy, sortBy, limit);
    return Meteor.users.find(parameters.find, parameters.options);
  }
  return [];
});
