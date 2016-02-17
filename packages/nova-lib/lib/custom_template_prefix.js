Meteor.startup(function () {

  // "custom_" is always loaded last, so it takes priority over every other prefix
  Telescope.config.addCustomPrefix("custom_");

});

