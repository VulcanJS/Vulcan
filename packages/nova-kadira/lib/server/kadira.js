Meteor.startup(function() {
  if(process.env.NODE_ENV === "production" && !!Telescope.settings.get('kadiraAppId') && !!Telescope.settings.get('kadiraAppSecret')){
    Kadira.connect(Telescope.settings.get('kadiraAppId'), Telescope.settings.get('kadiraAppSecret'));
  }
});
