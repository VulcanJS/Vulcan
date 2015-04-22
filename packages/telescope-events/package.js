Package.describe({
  name: "telescope:events",
  summary: "Telescope event tracking package",
  version: "0.1.1",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  api.use([
    'aldeed:simple-schema@1.3.2',
    'tap:i18n@1.4.1',
    'telescope:lib@0.3.0'
  ]);

  api.addFiles([
    'lib/events.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/analytics.js'
  ], ['client']);

  api.export([
    'Events'
  ]);
});
