Template.nav.events = {
  'click #logout': function(event){
      event.preventDefault();
      Meteor.logout();
  }
  , 'click #mobile-menu': function(event){
    event.preventDefault();
    $.pageslide({
      href: '#pageslide',
      iframe: false
    });
  }
  
  , 'click .login-header': function(e){
      e.preventDefault();
      Router.navigate('account', {trigger:true});
  }
};