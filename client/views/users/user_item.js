Template.user_item.helpers({
  avatarUrl: function(){
    return getAvatarUrl(this);
  },
  createdAtFormatted: function(){
    return this.createdAt ? moment(this.createdAt).fromNow() : '–';
  },
  displayName: function(){
    return getDisplayName(this);
  },
  getEmail: function(){
    return getEmail(this);
  },
  posts: function(){
    return Posts.find({'userId':this._id});
  },
  comments: function(){
    return Comments.find({'userId':this._id});
  },
  userIsAdmin: function(){
    return isAdmin(this);
  },
  profileUrl: function () {
    return getProfileUrl(this);
  },
  getKarma: function() {
    return Math.round(100*this.karma)/100;
  }
});

Template.user_item.events({
  'click .invite-link': function(e, instance){
    e.preventDefault();
    var user = Meteor.users.findOne(instance.data._id);
    Meteor.users.update(user._id,{
      $set:{
        isInvited: true
      }
    }, {multi: false}, function(error){
      if(error){
        throwError();
      }else{
        Meteor.call('createNotification', {
          event: 'accountApproved', 
          properties: {}, 
          userToNotify: user, 
          userDoingAction: Meteor.user(), 
          sendEmail: getSetting("emailNotifications")
        });
      }
    });
  },
  'click .uninvite-link': function(e, instance){
    e.preventDefault();
    Meteor.users.update(instance.data._id,{
      $set:{
        isInvited: false
      }
    });
  },
  'click .admin-link': function(e, instance){
    e.preventDefault();
    Meteor.users.update(instance.data._id,{
      $set:{
        isAdmin: true
      }
    });
  },
  'click .unadmin-link': function(e, instance){
    e.preventDefault();
    Meteor.users.update(instance.data._id,{
      $set:{
        isAdmin: false
      }
    });
  },
  'click .delete-link': function(e, instance){
    e.preventDefault();
    if(confirm(i18n.t("Are you sure you want to delete ")+getDisplayName(instance.data)+"?"))
      Meteor.users.remove(instance.data._id);
  }
})