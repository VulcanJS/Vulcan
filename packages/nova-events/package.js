Package.describe({
  name: "nova:events",
  summary: "Telescope event tracking package",
  version: "0.25.7",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  api.use([
    'nova:lib@0.25.7',
    // 'nova:i18n@0.25.7'
  ]);

  api.addFiles([
    'lib/events.js'
  ], ['client', 'server']);

  api.addFiles([
    // 'lib/client/analytics.js'
  ], ['client']);

  api.export([
    'Events'
  ]);
});
