Package.describe({
  name: "nova:events",
  summary: "Telescope event tracking package",
  version: "0.27.1-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  api.use([
    'nova:lib@0.27.1-nova'
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});
