getSiteUrl = function () {
  return getSetting('siteUrl', Meteor.absoluteUrl());
}

getSetting = function(setting, defaultValue){
  var settings = Settings.find().fetch()[0];

  if (Meteor.isServer && Meteor.settings && !!Meteor.settings[setting]) { // if on the server, look in Meteor.settings
    return Meteor.settings[setting];

  } else if (Meteor.settings && Meteor.settings.public && !!Meteor.settings.public[setting]) { // look in Meteor.settings.public
    return Meteor.settings.public[setting];

  } else if(settings && (typeof settings[setting] !== 'undefined')) { // look in Settings collection
    return settings[setting];

  } else if (typeof defaultValue !== 'undefined') { // fallback to default
    return  defaultValue;

  } else { // or return undefined
    return undefined;
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