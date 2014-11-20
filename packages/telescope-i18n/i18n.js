i18n = {
  t: function (str, options) {
    if (Meteor.isServer) {
      return TAPi18n.__(str, options, getSetting('language', 'en')); 
    } else {
      return TAPi18n.__(str, options); 
    }
  }
};

Meteor.startup(function () {
  
  var settingsLanguage = getSetting('language', 'en');

  moment.locale(settingsLanguage);
  
  if(Meteor.isClient){
    Session.set("i18n_ready", false);
    TAPi18n.setLanguage(settingsLanguage)
      .done(function () {
        Session.set("i18n_ready", true);
      });
  }
});
