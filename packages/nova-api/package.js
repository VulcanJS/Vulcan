Package.describe({
  name: "nova:api",
  summary: "Telescope API package",
  version: "0.26.4-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use(['nova:core@0.26.4-nova']);

  api.mainModule("lib/server.js", "server");
  // api.mainModule("lib/client.js", "client");

});
