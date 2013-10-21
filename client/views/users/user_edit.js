Template.user_edit.helpers({
  profileIncomplete : function() {
    return this && !this.loading && !userProfileComplete(this);
  },
  userEmail : function(){
    return getEmail(this);
  },
  hasNotificationsNone : function(){
    return this.profile && this.profile.notificationsFrequency == 0 ? 'checked' : '';
  },
  hasNotificationsActivity : function(){
    return this.profile && (this.profile.notificationsFrequency == 1 || typeof this.profile.notificationsFrequency === 'undefined') ? 'checked' : '';
  },
  hasNotificationsAll : function(){
    return this.profile && this.profile.notificationsFrequency == 2 ? 'checked' : '';
  }
})

Template.user_edit.events = {
  'submit form': function(e){
    e.preventDefault();

    if(!Meteor.user())
      throwError('You must be logged in.');
    
    var $target=$(e.target);
    var user = this;
    
    var update = {
      "profile.name": $target.find('[name=name]').val(),
      "profile.bio": $target.find('[name=bio]').val(),
      "profile.email": $target.find('[name=email]').val(),
      "profile.notificationsFrequency": parseInt($('input[name=notifications]:checked').val())
    };
    
    var old_password = $target.find('[name=old_password]').val();
    var new_password = $target.find('[name=new_password]').val();

    if(old_password && new_password){
   		Accounts.changePassword(old_password, new_password, function(error){
        // TODO: interrupt update if there's an error at this point
        if(error)
          throwError(error.reason);
      });
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
