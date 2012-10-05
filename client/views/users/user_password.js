(function(){

Template.user_password.events = {
  'click input[type=submit]': function(e){
    e.preventDefault();
   
    var options=new Object();
    options.email=$('#email').val();
    Accounts.forgotPassword(options, function(error){
    	if(error){
    		console.log(error);
    	}else{
    		throwError("Password reset link sent!");
    	}
    });

  }

};

})();