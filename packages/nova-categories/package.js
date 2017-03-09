Package.describe({
  name: "nova:categories",
  summary: "Telescope tags package",
  version: "1.2.0",
  git: "https://github.com/TelescopeJS/telescope-tags.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@1.2.0',
    'nova:posts@1.2.0',
    'nova:users@1.2.0'
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});