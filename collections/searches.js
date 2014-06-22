Searches = new Meteor.Collection("searches", {
  schema: new SimpleSchema({
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
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

