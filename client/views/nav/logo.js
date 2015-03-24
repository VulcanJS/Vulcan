Template[getTemplate('logo')].helpers({
  site_title: function(){
    return getSetting('title', "Telescope");
  },
  logo_url: function(){
    return getSetting('logoUrl');
  }
});