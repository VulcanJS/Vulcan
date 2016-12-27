Package.describe({
  name: "nova:notifications",
  summary: "Telescope notifications package",
  version: "1.0.0",
  git: "https://github.com/TelescopeJS/telescope-notifications.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@1.0.0',
    'nova:email@1.0.0',
    'nova:users@1.0.0'
  ]);

  api.addFiles([
    'lib/notifications.js',
    'lib/custom_fields.js'
  ], ['client', 'server']);

});