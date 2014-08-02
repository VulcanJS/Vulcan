Package.describe("Telescope email digest package");

Package.on_use(function (api) {

  api.use([
    'telescope-lib', 
    'telescope-base', 
    'simple-schema'
  ], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'iron-router',
    'templating'
  ], 'client');

  api.use([
    'handlebars-server'
  ], ['server']);

  api.add_files([
    'lib/campaign.js'
  ], ['client', 'server']);

  api.add_files([

  ], ['client']);

  api.add_files([
    'lib/server/build_campaign.js',
    'lib/server/routes.js',
    'lib/server/templates/emailPostItem.handlebars'
  ], ['server']);
  
  api.export([

  ]);
});