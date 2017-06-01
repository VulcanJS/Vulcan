Package.describe({
  name: "vulcan:voting",
  summary: "Telescope scoring package.",
  version: '1.4.0',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'vulcan:core@1.4.0',
    'vulcan:posts@1.4.0', 
    'vulcan:comments@1.4.0'
  ], ['client', 'server']);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");
  
});
