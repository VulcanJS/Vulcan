Package.describe({
  name: 'vulcan:test',
  summary: 'Vulcan test helpers',
  version: '1.12.8',
  git: 'https://github.com/VulcanJS/Vulcan.git'
});

Package.onUse(function (api) {

  api.versionsFrom('1.6.1');

  api.use([
    'vulcan:lib@1.12.8',
  ]);
  
  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
