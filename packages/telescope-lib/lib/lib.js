getSiteUrl = function () {
  return getSetting('siteUrl', Meteor.absoluteUrl());
}

getSetting = function(setting, defaultValue){
  var settings = Settings.find().fetch()[0];
  if(settings && (typeof settings[setting] !== 'undefined')){
    return settings[setting];
  }else{
    return typeof defaultValue === 'undefined' ? '' : defaultValue;
  }
};

getThemeSetting = function(setting, defaultValue){
  if(typeof themeSettings[setting] !== 'undefined'){
    return themeSettings[setting];
  }else{
    return typeof defaultValue === 'undefined' ? '' : defaultValue;
  }
};

camelToDash = function (str) {
  return str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
}

camelCaseify = function(str) {
  return dashToCamel(str.replace(' ', '-'));
}

dashToCamel = function (str) {
  return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
}

trimWords = function(s, numWords) {
  expString = s.split(/\s+/,numWords);
  if(expString.length >= numWords)
    return expString.join(" ")+"…";
  return s;
};

capitalise = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}