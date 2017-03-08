Package.describe({
  name: "nova:core",
  summary: "Telescope core package",
  version: "1.2.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:lib@1.2.0',
    'nova:users@1.2.0',
  ]);

  api.imply([
    'nova:lib@1.2.0'
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
