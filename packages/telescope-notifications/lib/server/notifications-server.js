Meteor.startup(function () {
  Herald.collection._ensureIndex({userId: 1, "media.email.send": 1, "media.email.sent": 1});
});

getUnsubscribeLink = function(user){
  return Telescope.utils.getRouteUrl('unsubscribe', {hash: user.telescope.emailHash});
};

Meteor.methods({
  unsubscribeUser : function(hash){
    check(hash, String);
    // TO-DO: currently, if you have somebody's email you can unsubscribe them
    // A user-specific salt should be added to the hashing method to prevent this
    var user = Meteor.users.findOne({"telescope.emailHash": hash});
    if(user){
      Meteor.users.update(user._id, {
        $set: {
          'profile.notifications.users' : 0,
          'profile.notifications.posts' : 0,
          'profile.notifications.comments' : 0,
          'profile.notifications.replies' : 0
        }
      });
      return true;
    }
    return false;
  }
});

