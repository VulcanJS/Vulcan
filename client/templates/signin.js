Template.signin.events = {
    'click input[type=submit]': function(){
      var username = $('#username input').val();
      var password = $('#password input').val();
      Meteor.loginWithPassword(username, password, function(err){
        if(err)
          alert(err);
        else
          Session.set('state', Session.get('previous_state'));
      });
  }

  , 'click a': function(){
      Session.set('state', 'signup');
  }
};

Template.signin.show = function(){
  return Session.equals('state', 'signin');
};
