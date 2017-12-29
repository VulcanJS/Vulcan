Package.describe({
  name: "vulcan:routing",
  summary: "Vulcan router package",
  version: '1.8.1',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom('METEOR@1.5.2');

  api.use([
    'vulcan:lib@1.8.1',
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
