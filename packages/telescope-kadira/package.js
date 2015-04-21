Package.describe({
  name: "telescope:kadira",
  summary: "Telescope Kadira package",
  version: "0.1.0",
  git: "https://github.com/TelescopeJS/telescope-kadira.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'templating',
    'telescope:lib@0.3.0',
    'telescope:settings@0.1.0',
    'tap:i18n@1.4.1',
    'meteorhacks:kadira@2.20.1'
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
