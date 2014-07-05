Template[getTemplate('signin')].events({
    'click input[type=submit]': function(event){
      event.preventDefault();
      var username = $('#username').val();
      var password = $('#password').val();
      Meteor.loginWithPassword(username, password, function(err){
        if(err){
          console.log(err);
          throwError(err.reason);
        }
      });
  },

  'click #signup': function(){
      // Session.set('state', 'signup');
      Router.go('/signup');
  },

  'click .twitter-button': function(){
    Meteor.loginWithTwitter(function(){
      Router.go('/');
    });
  },
   'click .facebook-button': function(){
        Meteor.loginWithFacebook(function(){
            Router.go('/');
        });
    }
});