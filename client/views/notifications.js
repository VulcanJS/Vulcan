Template.notifications.helpers({
  notifications: function(){
    var user=Meteor.user();
    if(user && !user.loading)
      return user.profile.notifications;
  }
});