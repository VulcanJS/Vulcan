Meteor.publish('pages', function() {
  return Pages.collection.find({});
});
