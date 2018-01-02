Package.describe({
  name: "vulcan:core",
  summary: "Vulcan core package",
  version: '1.8.2',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function(api) {

  api.versionsFrom('METEOR@1.5.2');

  api.use([
    'vulcan:lib@1.8.2',
    'vulcan:i18n@1.8.2',
    'vulcan:users@1.8.2',
    'vulcan:routing@1.8.2',
    'vulcan:debug@1.8.2',
  ]);

  api.imply([
    'vulcan:lib@1.8.2'
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
