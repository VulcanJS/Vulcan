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
  if(Meteor.isClient){
    Session.set("i18n_ready", false);
    TAPi18n.setLanguage(getSetting('language', 'en'))
      .done(function () {
        Session.set("i18n_ready", true);
      });
  }
});
