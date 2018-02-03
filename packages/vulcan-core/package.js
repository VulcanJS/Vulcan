Package.describe({
  name: "vulcan:core",
  summary: "Vulcan core package",
  version: '1.8.9',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function(api) {

  api.versionsFrom('1.6.1');

  api.use([
    'vulcan:lib@1.8.9',
    'vulcan:i18n@1.8.9',
    'vulcan:users@1.8.9',
    'vulcan:routing@1.8.9',
    'vulcan:debug@1.8.9',
  ]);

  api.imply([
    'vulcan:lib@1.8.9'
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
