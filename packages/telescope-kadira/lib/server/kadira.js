Meteor.startup(function() {
  if(!!Settings.get('kadiraAppId') && !!Settings.get('kadiraAppSecret')){
    Kadira.connect(Settings.get('kadiraAppId'), Settings.get('kadiraAppSecret'));
  }
});
