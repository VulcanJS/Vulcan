Package.describe({
  name: "telescope:settings",
  summary: "Telescope settings package",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {
  var both = ['server', 'client'];

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:lib@0.21.1', 
    'telescope:i18n@0.21.1'
  ]);

  api.addFiles([
    'lib/settings.js',
    'lib/router.js',
    'lib/menus.js',
    'package-tap.i18n'
  ], both);

  api.addFiles([
    'lib/server/publications.js',
  ], 'server');

  api.addFiles([
    'lib/client/language_changer.js',
    'lib/client/helpers.js',
    'lib/client/templates/settings.html',
    'lib/client/templates/settings.js'
  ], 'client');

  api.addFiles([
    "i18n/ar.i18n.json",
    "i18n/bg.i18n.json",
    "i18n/de.i18n.json",
    "i18n/el.i18n.json",
    "i18n/en.i18n.json",
    "i18n/es.i18n.json",
    "i18n/en.i18n.json",
    "i18n/fr.i18n.json"
  ], both);

  api.export('Settings', both);
});
