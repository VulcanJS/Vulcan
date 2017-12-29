Package.describe({
  name: "vulcan:i18n-en-us",
  summary: "Vulcan i18n package (en_US)",
  version: '1.8.1',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom('METEOR@1.5.2');

  api.use([
    'vulcan:core@1.8.1'
  ]);

  api.addFiles([
    'lib/en_US.js'
  ], ["client", "server"]);
});
