Package.describe({
  name: "vulcan:i18n-es-es",
  summary: "Vulcan i18n package (es_ES)",
  version: '1.8.11',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom('1.6.1');

  api.use([
    'vulcan:core@1.8.11'
  ]);

  api.addFiles([
    'lib/es_ES.js'
  ], ["client", "server"]);
});
