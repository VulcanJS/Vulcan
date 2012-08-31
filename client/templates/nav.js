Template.nav.events = {
    'click .site-nav a': function(event){
      event.preventDefault();
      Session.set('state', 'list');
  }

  , 'click .user-nav #signout': function(event){
      event.preventDefault();
      Meteor.logout();
  }

  , 'click .user-nav #signup': function(event){
      event.preventDefault();
      Session.set('previous_state', Session.get('state'));
      Session.set('state', 'signup');
  }

  , 'click .user-nav #signin': function(event){
      event.preventDefault();
      Session.set('previous_state', Session.get('state'));
      Session.set('state', 'signin');
  }

  , 'click .user-nav #submit': function(event){
      event.preventDefault();
      Session.set('previous_state', Session.get('state'));
      Session.set('state', 'submit');
  }
};

Template.nav.logged_in = function(){
  return Meteor.user() !== null;
};
