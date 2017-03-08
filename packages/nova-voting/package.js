Package.describe({
  name: "nova:voting",
  summary: "Telescope scoring package.",
  version: "1.2.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['nova:core@1.2.0']);

  api.use([
    'nova:posts@1.2.0', 
    'nova:comments@1.2.0'
  ], ['client', 'server']);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");
  
});
