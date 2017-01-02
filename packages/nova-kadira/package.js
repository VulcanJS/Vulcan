Package.describe({
  name: "nova:kadira",
  summary: "Telescope Kadira package",
  version: "1.0.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:core@1.0.0',
    'meteorhacks:kadira@2.30.0',
    'kadira:debug@3.2.2',
    'meteorhacks:kadira-profiler@1.2.1'
  ], ['client', 'server']);

  api.addFiles([
    'lib/kadira-settings.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/kadira.js'
  ], ['server']);

});
