Package.describe({
  name: 'vulcan:users',
  summary: 'Vulcan permissions.',
  version: '1.13.2',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  api.use(['vulcan:lib@1.13.2']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
Package.onTest(function(api) {
  api.use('vulcan:users');
  api.use(['ecmascript', 'meteortesting:mocha', 'hwillson:stub-collections']);
  api.mainModule('./test/server/index.js', 'server');
  //api.mainModule('./test/index.js');
});
