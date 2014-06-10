i18n = {

  translations: {},

  t: function (str) {
    var lang = getSetting('language', 'en');
    if(i18n.translations[lang] && i18n.translations[lang][str]){
      return i18n.translations[lang][str];
    }
    return str; 
  }

};

if(Meteor.isClient){
  UI.registerHelper('i18n', function(str){
    return i18n.t(str);
  }); 
}
