Package.describe({
  name: "telescope:settings",
  summary: "Telescope settings package",
  version: "0.1.0"
});

Package.onUse(function(api) {
  var both = ['server', 'client'];

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:lib@0.3.1', 
    'telescope:i18n@0.1.0'
  ]);

  api.addFiles([
    'lib/settings.js',
    'lib/router.js'
  ], both);

  api.addFiles([
    'lib/server/publications.js',
  ], 'server');

  api.addFiles([
    'lib/client/language_changer.js',
    'lib/client/helpers.js',
    'lib/client/templates/settings_form.html',
    'lib/client/templates/settings_form.js'
  ], 'client');

  api.export('Settings', both);
});
