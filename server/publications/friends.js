// Meteor.publish(null, function () {
//   return [Meteor.users.find(this.userId), Friends.find({userId: this.userId})];
// });

Meteor.publish('friends', function () {
  return Friends.find({'fbId': {$in: friendIds(this.userId)}});
});

