Package.describe({
  name: "nova:i18n-en-us",
  summary: "Telescope i18n package (en_US)",
  version: "0.3.0-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.3.0-nova'
  ]);

  api.addFiles([
    'lib/en_US.js'
  ], ["client", "server"]);
});
