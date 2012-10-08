Template.signin.events = {
    'click input[type=submit]': function(event){
      event.preventDefault();
      var username = $('#username').val();
      var password = $('#password').val();
      Accounts.loginWithPassword(username, password, function(err){
        if(err){
          console.log(err);
          throwError(err.reason);
        }else{
          // Session.set('state', Session.get('previous_state'));
          Router.navigate('', {trigger: true});
        } 
      });
  },

  'click #signup': function(){
      // Session.set('state', 'signup');
      Router.navigate('signup', {trigger: true});
  },

  'click .twitter-button': function(){
    Meteor.loginWithTwitter(function(){
      Router.navigate('/', {trigger: true});
    });
  }
};