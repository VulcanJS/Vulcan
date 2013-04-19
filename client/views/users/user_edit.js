Template.user_edit.helpers({
  profileIncomplete : function() {
    return Meteor.user() && !this.loading && !userProfileComplete(this);
  },
  user : function(){
    var currentUser = Meteor.user();
    if(Session.get('selectedUserId') && !currentUser.loading && currentUser.isAdmin){
      currentUser = Meteor.users.findOne(Session.get('selectedUserId'));
    }
    return currentUser;
  },
  userEmail : function(){
    var currentUser = Meteor.user();
    if(Session.get('selectedUserId') && !currentUser.loading && currentUser.isAdmin){
      currentUser = Meteor.users.findOne(Session.get('selectedUserId'));
    }
    return getEmail(currentUser);
  },
  hasNotificationsNone : function(){
    return Meteor.user().profile && Meteor.user().profile.notificationsFrequency == 0 ? 'checked' : '';
  },
  hasNotificationsActivity : function(){
    var u = Meteor.user();
    return u.profile && (u.profile.notificationsFrequency == 1 || typeof u.profile.notificationsFrequency === 'undefined') ? 'checked' : '';
  },
  hasNotificationsAll : function(){
    return Meteor.user().profile && Meteor.user().profile.notificationsFrequency == 2 ? 'checked' : '';
  }
})

Template.user_edit.events = {
  'submit form': function(e){
    e.preventDefault();
    if(!Meteor.user()) throwError('You must be logged in.');
    var $target=$(e.target);
    var user=Session.get('selectedUserId') ? Meteor.users.findOne(Session.get('selectedUserId')) : Meteor.user();
    
    var update = {
      "profile.name": $target.find('[name=name]').val(),
      "profile.bio": $target.find('[name=bio]').val(),
      "profile.email": $target.find('[name=email]').val(),
      "profile.notificationsFrequency": parseInt($('input[name=notifications]:checked').val())
    };
    
    // TODO: enable change email
    var email = $target.find('[name=email]').val();
    
    var old_password = $target.find('[name=old_password]').val();
    var new_password = $target.find('[name=new_password]').val();

    // XXX we should do something if there is an error updating these things
    if(old_password && new_password){
   		Meteor.changePassword(old_password, new_password);
    }
    
    Meteor.users.update(user._id, {
      $set: update
    }, function(error){
      if(error){
        throwError(error.reason);
      } else {
        throwError('Profile updated');
      }
    });
  }

};
