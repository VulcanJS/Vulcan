Package.describe({
  summary: "Telescope update prompt package.",
  version: '0.1.0',
  name: "telescope-update-prompt"
});

Package.onUse(function (api) {

  api.use(['telescope-lib', 'telescope-base', 'http'], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'iron:router',
    'templating'
  ], 'client');


  api.add_files([
    'lib/client/update.js',
    'lib/client/templates/update_banner.html',
    'lib/client/templates/update_banner.js',
    'lib/client/templates/update_banner.css'
  ], ['client']);

  api.add_files([
    'lib/server/phone_home.js'
  ], ['server']);

  api.export([
    'compareVersions'
  ]);
});