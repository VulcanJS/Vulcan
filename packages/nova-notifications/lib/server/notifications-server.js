import Telescope from 'meteor/nova:lib';

getUnsubscribeLink = function(user){
  return Telescope.utils.getRouteUrl('unsubscribe', {hash: user.telescope.emailHash});
};


Meteor.methods({
  sawNotification : function(link){
    check(link, String);
    user = Meteor.user()
    noteData = _.findWhere(user.telescope.notifications,{link:link})
    //TODO: nothing to do ;P
    console.log(noteData)
    if( !_.isEmpty(noteData) )
      if( Meteor.users.update(user._id, { $pull: {"telescope.notifications": {link:link}} }))
      return true;
      else return false;
  },
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



