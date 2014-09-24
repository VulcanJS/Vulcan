Package.describe({
  summary: "Telescope Kadira package",
  version: '0.1.0',
  name: "telescope-kadira"
});

Package.onUse(function (api) {

  api.use([
    'telescope-lib', 
    'telescope-base'
  ], ['client', 'server']);

  api.use([
    'meteorhacks:kadira'
  ], ['server']);

  api.add_files([
    'lib/kadira-settings.js'
  ], ['client', 'server']);

  api.add_files([
    'lib/server/kadira.js'
  ], ['server']);

});