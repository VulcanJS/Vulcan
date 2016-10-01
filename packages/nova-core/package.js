Package.describe({
  name: "nova:core",
  summary: "Telescope core package",
  version: "0.27.2-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:lib@0.27.2-nova',
    'nova:events@0.27.2-nova'
  ]);
  
  api.imply([
    'nova:lib@0.27.2-nova'
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});
