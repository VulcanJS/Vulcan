// do this better:
setLanguage = function (language) {
  // Session.set('i18nReady', false);
  // console.log('i18n loading… '+language)

  // moment
  Session.set('momentReady', false);
  // console.log('moment loading…')
  if (language.toLowerCase() === "en") {
    Session.set('momentReady', true);
  } else {
    $.getScript("//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/lang/" + language.toLowerCase() + ".js", function (result) {
      moment.locale(language);
      Session.set('momentReady', true);
      Session.set('momentLocale', language);
      // console.log('moment loaded!')
    });
  }

  // TAPi18n
  Session.set("TAPi18nReady", false);
  // console.log('TAPi18n loading…')
  TAPi18n.setLanguage(language)
    .done(function () {
      Session.set("TAPi18nReady", true);
      // console.log('TAPi18n loaded!')
    });

  // T9n
  T9n.setLanguage(language);
}

i18n = {
  t: function (str, options) {
    if (Meteor.isServer) {
      return TAPi18n.__(str, options, Settings.get('language', 'en'));
    } else {
      return TAPi18n.__(str, options);
    }
  }
};

Meteor.startup(function () {

  if (Meteor.isClient) {

    // doesn't quite work yet
    // Tracker.autorun(function (c) {
    //   console.log('momentReady',Session.get('momentReady'))
    //   console.log('i18nReady',Session.get('i18nReady'))
    //   var ready = Session.get('momentReady') && Session.get('i18nReady');
    //   if (ready) {
    //     Session.set('i18nReady', true);
    //     Session.set('locale', language);
    //     console.log('i18n ready! '+language)
    //   }
    // });

    setLanguage(Settings.get('language', 'en'));
  }

});
