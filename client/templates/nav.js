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
      // Session.set('previous_state', Session.get('state'));
      // Session.set('state', 'signup');
      Router.navigate('signup', {trigger: true});
  }

  , 'click #signin': function(event){
      event.preventDefault();
      // Session.set('previous_state', Session.get('state'));
      // Session.set('state', 'signin');
      Router.navigate('signin', {trigger: true});
  }

  , 'click #submit': function(event){
      event.preventDefault();
      // Session.set('previous_state', Session.get('state'));
      // Session.set('state', 'submit');
      Router.navigate('submit', {trigger: true});
  }

  , 'click #mobile-menu': function(event){
    event.preventDefault();
    $.pageslide({
      href: '#pageslide',
      iframe: false
    });
  }

  , 'click .top': function(event){
      event.preventDefault();
      Router.navigate('top', {trigger: true});
  }

  , 'click .new': function(event){
      event.preventDefault();
      Router.navigate('new', {trigger: true});
  }

  , 'click .login-header': function(e){
      e.preventDefault();
      Router.navigate('account', {trigger:true});
  }
};

Template.nav.logged_in = function(){
  return Meteor.user() !== null;
};

Template.nav.site_title = function(){
  var setting=Settings.find().fetch()[0];
  if(setting){
    return setting.title;
  }
}

Template.nav.is_admin = function(){
    return currentUserIsAdmin();
  };

Template.nav.rendered = function(){

  var setting=Settings.find().fetch()[0];
  if(setting){
    document.title = setting.title;
  }

};