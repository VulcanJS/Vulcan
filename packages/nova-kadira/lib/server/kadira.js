Meteor.startup(function() {
  if(!!Telescope.settings.get('kadiraAppId') && !!Telescope.settings.get('kadiraAppSecret')){
    Kadira.connect(Telescope.settings.get('kadiraAppId'), Telescope.settings.get('kadiraAppSecret'));
  }
});
