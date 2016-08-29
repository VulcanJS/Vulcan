Package.describe({
  name: "nova:categories",
  summary: "Telescope tags package",
  version: "0.27.0-nova",
  git: "https://github.com/TelescopeJS/telescope-tags.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.27.0-nova',
    'nova:posts@0.27.0-nova',
    'nova:users@0.27.0-nova'
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});