Meteor.startup(function() {
  if(!!getSetting('kadiraAppId') && !!getSetting('kadiraAppSecret')){
    Kadira.connect(getSetting('kadiraAppId'), getSetting('kadiraAppSecret'));
  }
});