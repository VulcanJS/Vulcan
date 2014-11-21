// do this better:
setLanguage = function (language) {

  // moment
  $.getScript("//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/lang/" + language + ".js", function (result) {
    moment.locale(language);
    Session.set('momentLocale', language);
  });

  // TAPi18n
  Session.set("i18nReady", false);
  TAPi18n.setLanguage(language)
    .done(function () {
      Session.set("i18nReady", true);
    });

  // T9n
  T9n.setLanguage(language);
}

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
  
  if(Meteor.isClient)
    setLanguage(getSetting('language', 'en'));

});
