Template.user_signup.events = {
    'click input[type=submit]': function(event){
      event.preventDefault();
      var username = $('#username').val();
      var email = $('#email').val();
      var password = $('#password').val();
      Accounts.createUser({
          username: username
        , email: email  
        , password: password
      }, null, function(err){
        if(err){
          console.log(err);
          alert(err);
        }else{
          // Session.set('state', Session.get('previous_state'));
          Meteor.Router.navigate('/');
        }  
      });
  },

  'click #signin': function(){
      // Session.set('state', 'signin');
      Meteor.Router.to('/signin');
  },

  'click .twitter-button': function(){
    Meteor.loginWithTwitter(function(){
      Meteor.Router.to('/');
    });
  }
};