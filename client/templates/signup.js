Template.signup.events = {
    'click input[type=submit]': function(){
      var username = $('#username input').val();
      var password = $('#password input').val();
      Meteor.createUser({
          username: username
        , password: password
      }, null, function(err){
        if(err)
          alert(err);
        else
          Session.set('state', Session.get('previous_state'));
      });
  }

  , 'click a': function(){
      Session.set('state', 'signin');
  }
};

Template.signup.show = function(){
  return Session.equals('state', 'signup');
};
