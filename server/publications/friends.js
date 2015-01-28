Meteor.publish('friends', function () {
	return Friends.find({facebookId: {$in: facebookIds}}, {fields: friendsOptions, multi: true});
});

