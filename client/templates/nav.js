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

Template.nav.helpers({
  site_title: function(){
    return getSetting('title');
  }

  ,logo_url: function(){
    return getSetting('logoUrl');
  }
 
  ,logo_height: function(){
    return getSetting('logoHeight');
  }
 
  ,logo_width: function(){
    return getSetting('logoWidth');
  }

  ,logo_top: function(){
    return Math.floor((70-getSetting('logoHeight'))/2);
  }  

  ,logo_offset: function(){
    return -Math.floor(getSetting('logoWidth')/2);
  }      
});