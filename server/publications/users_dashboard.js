// Publish all users

Meteor.publish('allUsers', function(filterBy, sortBy, limit) {
  if(isAdminById(this.userId)){
    var parameters = getUsersParameters(filterBy, sortBy, limit);
    if (!isAdminById(this.userId)) // if user is not admin, filter out sensitive info
      parameters.options = _.extend(parameters.options, {fields: privacyOptions});
    return Meteor.users.find(parameters.find, parameters.options);
  }
  return [];
});