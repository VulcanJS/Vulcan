Meteor.publish('pages', function() {
  return Pages.find({});
});
