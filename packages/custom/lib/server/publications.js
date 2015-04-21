Meteor.publish('customPublication', function (limit) {
  return Posts.find({}, {limit: limit});
});