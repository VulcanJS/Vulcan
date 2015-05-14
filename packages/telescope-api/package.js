Package.describe({
  name: "telescope:api",
  summary: "Telescope API package",
  version: "0.1.0",
  git: "https://github.com/TelescopeJS/telescope-api.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use(['telescope:core@0.1.0']);

  api.addFiles(['lib/server/api.js', 'lib/server/routes.js'], ['server']);

});
