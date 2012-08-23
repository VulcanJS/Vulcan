Template.nav.events = {
  'click .site-nav a': function(event){
    event.preventDefault();
    Session.set('selected_post', null);
    Session.set('state', 'list');
  }
};
