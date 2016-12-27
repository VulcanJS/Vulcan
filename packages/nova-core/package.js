Package.describe({
  name: "nova:core",
  summary: "Telescope core package",
  version: "1.0.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:lib@1.0.0',
    'nova:users@1.0.0',
  ]);

  api.imply([
    'nova:lib@1.0.0'
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});
