Package.describe({
  name: "nova:api",
  summary: "Telescope API package",
  version: "0.25.7",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use(['nova:core@0.25.7']);

  api.addFiles([
    'lib/server/api.js', 
    'lib/server/routes.js'
  ], ['server']);

});
