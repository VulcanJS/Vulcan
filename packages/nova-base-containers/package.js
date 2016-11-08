Package.describe({
  name: "nova:base-containers",
  summary: "Telescope containers package",
  version: "0.27.3-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    // Nova packages
    'nova:core@0.27.3-nova',
    'nova:posts@0.27.3-nova',
    'nova:users@0.27.3-nova',
    'nova:comments@0.27.3-nova',
    'nova:categories@0.27.3-nova',
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");
  
});
