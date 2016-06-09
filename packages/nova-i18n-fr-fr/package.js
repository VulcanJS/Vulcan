Package.describe({
  name: "nova:i18n-fr-fr",
  summary: "Telescope i18n package (fr_FR)",
  version: "0.26.2-nova",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");
  
  api.use([
    'nova:core@0.26.2-nova'
  ]);

  api.addFiles([
    'lib/fr_FR.js'
  ], ["client", "server"]);
});
