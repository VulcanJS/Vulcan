Meteor.publish('friends', function () {
  if (typeof facebookIds === "undefined") {
    return [];
  }
  return Friends.find({facebookId: {$in: facebookIds}}, {fields: friendsOptions, multi: true});
});

