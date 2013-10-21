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
