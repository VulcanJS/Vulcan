Template.users.users = function(){
  var users = Meteor.users.find({}, {sort: {createdAt: -1}});
  return users;
};
