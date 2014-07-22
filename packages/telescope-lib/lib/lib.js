getSiteUrl = function () {
  return getSetting('siteUrl', Meteor.absoluteUrl());
}

getSetting = function(setting, defaultValue){
  var settings=Settings.find().fetch()[0];
  if(settings && settings[setting]){
    return settings[setting];
  }else{
    return typeof defaultValue === 'undefined' ? '' : defaultValue;
  }
};

camelToDash = function (str) {
  return str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
}

dashToCamel = function (str) {
  return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
}