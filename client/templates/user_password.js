(function(){

Template.user_password.events = {
  'click input[type=submit]': function(e){
    e.preventDefault();
   
    var options=new Object();
    options.email=$('#email').val();
    Meteor.forgotPassword(options, function(error){
    	if(error){
    		alert(error);
    	}else{
    		alert("Password reset link sent!");
    	}
    });

  }

};

})();