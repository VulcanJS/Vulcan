Package.describe({
  name: "custom-collection-demo",
  summary: "Telescope components package",
  version: "0.27.4-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:core@0.27.4-nova',
  ]);

  api.mainModule("server.js", "server");
  api.mainModule("client.js", "client");
  
});
