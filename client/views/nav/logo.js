Template[getTemplate('logo')].helpers({
  site_title: function(){
    return Settings.get('title', "Telescope");
  },
  logo_url: function(){
    return Settings.get('logoUrl');
  }
});
