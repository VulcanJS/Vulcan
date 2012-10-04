Template.signup.events = {
    'click input[type=submit]': function(event){
      event.preventDefault();
      var username = $('#username').val();
      var email = $('#email').val();
      var password = $('#password').val();
      Meteor.createUser({
          username: username
        , email: email  
        , password: password
      }, null, function(err){
        if(err){
          console.log(err);
          alert(err);
        }else{
          // Session.set('state', Session.get('previous_state'));
          Router.navigate('', {trigger: true});
        }  
      });
  }

  , 'click #signin': function(){
      // Session.set('state', 'signin');
      Router.navigate('signin', {trigger: true});
  }
};