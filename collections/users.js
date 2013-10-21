
Meteor.users.allow({
  update: isAdminById,
  remove: isAdminById
});