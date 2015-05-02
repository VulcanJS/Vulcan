Template.logo.helpers({
  siteTitle: function(){
    return Settings.get('title', "Telescope");
  },
  logoUrl: function(){
    return Settings.get('logoUrl');
  }
});
