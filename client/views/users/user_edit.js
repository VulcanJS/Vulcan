Template.user_edit.helpers({
  profileIncomplete : function() {
    return this && !this.loading && !userProfileComplete(this);
  },
  userEmail : function(){
    return getEmail(this);
  },
  hasNotificationsPosts : function(){
    return getUserSetting('notifications.posts') ? 'checked' : '';
  },
  hasNotificationsComments : function(){
    return getUserSetting('notifications.comments') ? 'checked' : '';
  },
  hasNotificationsReplies : function(){
    return getUserSetting('notifications.replies') ? 'checked' : '';
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
      "profile.notifications.posts": $('input[name=notifications_posts]:checked').length,
      "profile.notifications.comments": $('input[name=notifications_comments]:checked').length,
      "profile.notifications.replies": $('input[name=notifications_replies]:checked').length
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
