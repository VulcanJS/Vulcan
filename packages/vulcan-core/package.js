Package.describe({
  name: 'vulcan:core',
  summary: 'Vulcan core package',
  version: '1.12.13',
  git: 'https://github.com/VulcanJS/Vulcan.git'
});

Package.onUse(function (api) {
  api.versionsFrom('1.6.1');

  api.use([
    'vulcan:lib@1.12.13',
    'vulcan:i18n@1.12.13',
    'vulcan:users@1.12.13',
    'vulcan:routing@1.12.13',
    'vulcan:debug@1.12.13'
  ]);

  api.imply(['vulcan:lib@1.12.13']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});

Package.onTest(function (api) {
  api.use(['ecmascript', 'meteortesting:mocha', 'vulcan:test', 'vulcan:core']);
  api.mainModule('./test/index.js');
});
