Package.describe({
  name: "nova:voting",
  summary: "Telescope scoring package.",
  version: "0.27.5-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['nova:core@0.27.5-nova']);

  api.use([
    'nova:posts@0.27.5-nova', 
    'nova:comments@0.27.5-nova'
  ], ['client', 'server']);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");
  
});
