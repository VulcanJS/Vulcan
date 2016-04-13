Package.describe({
  name: "nova:debug",
  summary: "Telescope debug package",
  version: "0.25.7",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    // Nova packages

    'nova:core@0.25.7',
    'nova:posts@0.25.7',
    'nova:users@0.25.7',
    'nova:comments@0.25.7'
  ]);

  api.addFiles([
    'lib/routes.jsx'
  ], ['client', 'server']);



});
