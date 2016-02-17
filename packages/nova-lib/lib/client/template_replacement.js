Meteor.startup(function () {

  // loop over custom prefixes
  Telescope.config.customPrefixes.forEach(function (prefix) {
    
    // for each prefix, loop over all templates to find any replacements
    Template.forEach(function (template) {

      var templateName = template.viewName.replace("Template.", "");
      
      // if current template name starts with the prefix, find original template and replace it
      if (templateName.slice(0,prefix.length) === prefix) {
        var oldTemplate = templateName.slice(prefix.length);
        template.replaces(oldTemplate);
      }

    });

  });
});
