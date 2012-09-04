Template.signin.events = {
    'click input[type=submit]': function(event){
      event.preventDefault();
      var username = $('#username').val();
      var password = $('#password').val();
      Meteor.loginWithPassword(username, password, function(err){
        if(err){
          console.log(err);
          alert(err);
        }else{
          Session.set('state', Session.get('previous_state'));
        } 
      });
  }

  , 'click #signup': function(){
      Session.set('state', 'signup');
  }
};