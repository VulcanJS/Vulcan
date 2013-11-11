Template.user_edit.helpers({
  profileIncomplete : function() {
    return this && !this.loading && !userProfileComplete(this);
  },
  userName: function(){
    return getUserName(this);
  },
  userEmail : function(){
    return getEmail(this);
  },
  getTwitter: function(){
    return getTwitterName(this) || "";
  },
  getGitHub: function(){
    return getGitHubName(this) || "";
  },
  profileUrl: function(){
    return Meteor.absoluteUrl()+"users/"+this.slug;
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
    var name = $target.find('[name=name]').val();
    var user = this;
    var update = {
      "profile.name": name,
      "profile.slug": slugify(name),
      "profile.bio": $target.find('[name=bio]').val(),
      "profile.email": $target.find('[name=email]').val(),
      "profile.twitter": $target.find('[name=twitter]').val(),
      "profile.github": $target.find('[name=github]').val(),
      "profile.site": $target.find('[name=site]').val(),
      "profile.notifications.posts": $('input[name=notifications_posts]:checked').length,
      "profile.notifications.comments": $('input[name=notifications_comments]:checked').length,
      "profile.notifications.replies": $('input[name=notifications_replies]:checked').length,
      "invitesCount": parseInt($target.find('[name=invitesCount]').val())
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
