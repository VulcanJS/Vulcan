Package.describe({
  name: "telescope:events",
  summary: "Telescope event tracking package",
  version: "0.25.5",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  api.use([
    'telescope:lib@0.25.5',
    'telescope:i18n@0.25.5'
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
