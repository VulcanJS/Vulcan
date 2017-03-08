Package.describe({
  name: "nova:events",
  summary: "Telescope event tracking package",
  version: "1.2.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  api.use([
    'nova:core@1.2.0',
    'nova:posts@1.2.0', // needed to track posts click
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});
