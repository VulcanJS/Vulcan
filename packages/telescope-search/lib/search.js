Searches = new Meteor.Collection("searches", {
  schema: new SimpleSchema({
    _id: {
      type: String,
      optional: true
    },
    timestamp: {
      type: Date
    },
    keyword: {
      type: String
    }
  })
});

Searches.allow({
  update: isAdminById
, remove: isAdminById
});

// XXX
// TODO: find a way to make this use the same isAdminById as the rest of the app
isAdminById=function(userId){
  var user = Meteor.users.findOne(userId);
  return !!(user && isAdmin(user));
};