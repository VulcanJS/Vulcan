Template.nav.events = {
    'click .site-nav a': function(event){
      event.preventDefault();
      Session.set('state', 'list');
  }

  , 'click #logout': function(event){
      event.preventDefault();
      Meteor.logout();
  }

  , 'click #signup': function(event){
      event.preventDefault();
      Session.set('previous_state', Session.get('state'));
      Session.set('state', 'signup');
  }

  , 'click #signin': function(event){
      event.preventDefault();
      Session.set('previous_state', Session.get('state'));
      Session.set('state', 'signin');
  }

  , 'click #submit': function(event){
      event.preventDefault();
      Session.set('previous_state', Session.get('state'));
      Session.set('state', 'submit');
  }
};

Template.nav.logged_in = function(){
  return Meteor.user() !== null;
};
