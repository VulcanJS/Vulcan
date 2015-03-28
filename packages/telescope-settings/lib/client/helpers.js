/* global Settings: false */

Template.registerHelper('getSetting', function(setting, defaultArgument){
  setting = Settings.get(setting, defaultArgument);
  return setting;
});
