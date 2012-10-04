Template.notifications.helpers({
  notifications: function(){
    var user=Meteor.user();
    console.log(Meteor.user());
    if(user && !user.loading)
      return user.profile && user.profile.notifications;
  }
});