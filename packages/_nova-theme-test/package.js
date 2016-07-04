Package.describe({
  name: "theme-test",
  summary: "Telescope components package",
  version: "0.26.4-nova",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:lib@0.26.4-nova'
  ]);

  api.addFiles([
    'require.js',
  ], ['client', 'server']);

});
