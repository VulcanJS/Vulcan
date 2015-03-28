Package.describe({summary: "Telescope settings package"});

Package.onUse(function(api) {
  var both = ['server', 'client'];

  api.use([
    'mongo',
    'underscore',

    'aldeed:simple-schema',

    'telescope-base',
    'telescope-lib'
  ], both);

  api.use([
    'templating',
    'aldeed:autoform'
  ], 'client');

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
