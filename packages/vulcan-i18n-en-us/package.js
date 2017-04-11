Package.describe({
  name: "vulcan:i18n-en-us",
  summary: "Telescope i18n package (en_US)",
  version: '1.3.2',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'vulcan:core@1.3.2'
  ]);

  api.addFiles([
    'lib/en_US.js'
  ], ["client", "server"]);
});
