Template.user_email.events = {
  'submit form': function(e){
    e.preventDefault();
    if(!Meteor.user()) throwError('You must be logged in.');
    var $target=$(e.target);
    var user=Session.get('selectedUserId')? Meteor.users.findOne(Session.get('selectedUserId')) : Meteor.user();
    var update = {
      "profile.email": $target.find('[name=email]').val()
    };
    
    // TODO: enable change email
    var email = $target.find('[name=email]').val();
    
    Meteor.users.update(user._id, {
      $set: update
    }, function(error){
      if(error){
        throwError(error.reason);
      } else {
        throwError('Thanks for signing up!');
        trackEvent("new sign-up", {'userId': user._id, 'auth':'twitter'});
        Meteor.Router.to('/');
      }
    });
  }

};

Template.user_email.profileIncomplete = function() {
  return Meteor.user() && !this.loading && !userProfileComplete(this);
}

Template.user_email.user = function(){
	var current_user=Meteor.user();
	if(Session.get('selectedUserId') && !current_user.loading && current_user.isAdmin){
	  return Meteor.users.findOne(Session.get('selectedUserId'));
	}else{
		return current_user;
	}
}