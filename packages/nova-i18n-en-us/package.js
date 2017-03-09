Package.describe({
  name: "nova:i18n-en-us",
  summary: "Telescope i18n package (en_US)",
  version: "1.2.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@1.2.0'
  ]);

  api.addFiles([
    'lib/en_US.js'
  ], ["client", "server"]);
});
