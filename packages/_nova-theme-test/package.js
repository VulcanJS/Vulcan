Package.describe({
  name: "theme-test",
  summary: "Telescope components package",
  version: "0.25.7",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:lib@0.25.7'
  ]);

  api.addFiles([
    'require.js',
  ], ['client', 'server']);

});
