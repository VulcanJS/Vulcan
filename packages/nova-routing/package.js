Package.describe({
  name: "nova:routing",
  summary: "Nova router package",
  version: "0.27.4-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    // Nova packages
    'nova:core@0.27.4-nova',
    'nova:apollo@0.27.4-nova',
  ]);

  api.addFiles([
    'lib/store.js',
    'lib/routing.jsx'
  ], ['client', 'server']);

});
