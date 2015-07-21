Package.describe({
  name: "telescope:update-prompt",
  summary: "Telescope update prompt package.",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/telescope-update-prompt.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['telescope:core@0.21.1']);


  api.addFiles([
    'lib/package_versions.js'
  ], ['client','server']);

  api.addFiles([
    'lib/client/update.js',
    'lib/client/templates/update_banner.html',
    'lib/client/templates/update_banner.js',
    'lib/client/templates/update_banner.css'
  ], ['client']);

  api.addFiles([
    'lib/server/phone_home.js'
  ], ['server']);

  api.export([
    'compareVersions'
  ]);
});
