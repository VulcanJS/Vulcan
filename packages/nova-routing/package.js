Package.describe({
  name: "nova:routing",
  summary: "Nova router package",
  version: "1.0.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    // Nova packages
    'nova:core@1.0.0',
    'nova:apollo@1.0.0',
  ]);

  api.mainModule('lib/routing.jsx', ['client', 'server']);

});
