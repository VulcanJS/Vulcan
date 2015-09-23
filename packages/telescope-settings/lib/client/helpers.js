Template.registerHelper('getSetting', function(setting, defaultArgument){
  // if there is no default argument, defaultArgument will be a Spacebars.kw object; so set it to undefined
  // see http://stackoverflow.com/questions/27755891/meteor-what-is-spacebars-kw-hash-object
  var defaultArgument = !!defaultArgument.hash ? undefined : defaultArgument;
  setting = Settings.get(setting, defaultArgument);
  return setting;
});
