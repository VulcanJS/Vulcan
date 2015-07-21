Meteor.startup(function () {
  var prefix  = Telescope.config.customPrefix;

  // loop over templates and see if they're a custom template replacement
  Template.forEach(function (template) {

    var templateName = template.viewName.replace("Template.", "");
    
    // if template name starts with "custom_" (or another predefined prefix), make the replacement
    if (templateName.slice(0,prefix.length) === prefix) {

      var oldTemplate = templateName.slice(prefix.length);
      template.replaces(oldTemplate);

    }
  });
});