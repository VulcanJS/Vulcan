Template.user_signup.events = {
    'click input[type=submit]': function(event){
      event.preventDefault();
      var username = $('#username').val();
      var email = $('#email').val();
      var password = $('#password').val();
      if(!username || !email || !password){
        throwError('Please fill in all fields');
        return false;
      }
      Accounts.createUser({
          username: username
        , email: email  
        , password: password
      }, function(err){
        if(err){
          console.log(err);
        }else{
          Meteor.Router.to('/');
        }  
      });
  },

  'click #signin': function(){
      Meteor.Router.to('/signin');
  },

  'click .twitter-button': function(){
    Meteor.loginWithTwitter(function(){
      Meteor.Router.to('/');
    });
  }
};