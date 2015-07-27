Package.describe({
  name: "telescope:kadira",
  summary: "Telescope Kadira package",
  version: "0.22.1",
  git: "https://github.com/TelescopeJS/telescope-kadira.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:core@0.22.1',
    'meteorhacks:kadira@2.20.6',
    'kadira:debug@2.1.0'
  ], ['client', 'server']);

  api.addFiles([
    'package-tap.i18n',
    'lib/kadira-settings.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/kadira.js'
  ], ['server']);

  api.addFiles([
    "i18n/en.i18n.json"
  ], ["client", "server"]);

});
