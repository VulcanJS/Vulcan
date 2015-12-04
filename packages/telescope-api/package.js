Package.describe({
  name: "telescope:api",
  summary: "Telescope API package",
  version: "0.25.5",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use(['telescope:core@0.25.5']);

  api.addFiles(['lib/server/api.js', 'lib/server/routes.js'], ['server']);

});
