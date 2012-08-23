Template.nav.events = {
  'click .site-nav a': function(evt){
    evt.preventDefault();
    Session.set('selected_post', null);
  }
};
