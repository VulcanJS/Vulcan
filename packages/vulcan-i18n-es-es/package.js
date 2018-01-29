Package.describe({
  name: "vulcan:i18n-es-es",
  summary: "Vulcan i18n package (es_ES)",
  version: '1.8.7',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom('METEOR@1.5.2');

  api.use([
    'vulcan:core@1.8.7'
  ]);

  api.addFiles([
    'lib/es_ES.js'
  ], ["client", "server"]);
});
