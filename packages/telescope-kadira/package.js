Package.describe({
  summary: "Telescope Kadira package",
  version: '0.1.0',
  name: "telescope-kadira"
});

Package.onUse(function (api) {

  api.use([
    'templating',
    'telescope-lib', 
    'telescope-base',
    'tap:i18n',
    'meteorhacks:kadira@2.17.2'
  ], ['client', 'server']);

  api.add_files([
    'package-tap.i18n',
    'lib/kadira-settings.js'
  ], ['client', 'server']);

  api.add_files([
    'lib/server/kadira.js'
  ], ['server']);

  api.add_files([
    "i18n/en.i18n.json"
  ], ["client", "server"]);

});