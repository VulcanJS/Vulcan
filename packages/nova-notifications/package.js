Package.describe({
  name: "nova:notifications",
  summary: "Telescope notifications package",
  version: "0.27.0-nova",
  git: "https://github.com/TelescopeJS/telescope-notifications.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.27.0-nova',
    'nova:email@0.27.0-nova',
    'nova:users@0.27.0-nova'
  ]);

  api.addFiles([
    'lib/notifications.js',
    'lib/custom_fields.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/notifications-server.js'
  ], ['server']);

});