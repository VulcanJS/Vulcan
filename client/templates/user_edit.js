(function(){

Template.user_edit.events = {
  'click input[type=submit]': function(e){
    e.preventDefault();
    if(!Meteor.user()) throw 'You must be logged in.';

    var user=window.selected_user_id? Meteor.users.findOne(window.selected_user_id) : Meteor.user();
    var username= $('#title').val();
    var email = $('#url').val();
    var bio = $('#bio').val();
    var old_password = $('#new_password').val();
    var new_password = $('#new_password').val();

    if(old_password && new_password){
   		Meteor.changePassword(old_password, new_password);
    }

    Meteor.users.update(user._id,
 		{
	   		$set: {
                "profile.bio": bio
	    	}
    	},
        function(error){
            if(error){
                throwError(error.reason);
            }else{
                throwError('Profile updated');
            }
        }
    );
  }

};

Template.user_edit.user = function(){
	var current_user=Meteor.user();
	if(window.selected_user_id && !current_user.loading && current_user.isAdmin){
	  return Meteor.users.findOne(window.selected_user_id);
	}else{
		return current_user;
	}
}

Template.user_edit.email = function(){
	if(!this.loading){
		return this.emails[0].address;
	}
}

Template.user_edit.bio = function(){
    if(!this.loading && this.profile){
        return this.profile.bio;
    }
}

})();