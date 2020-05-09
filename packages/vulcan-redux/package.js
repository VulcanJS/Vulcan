Package.describe({
  name: 'vulcan:redux',
  summary: 'Add Redux to Vulcan.',
  version: '1.15.0',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function (api) {
  api.versionsFrom('1.6.1');

  api.use(['vulcan:core@=1.15.0']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});

Package.onTest(function (api) {
  api.use(['ecmascript', 'meteortesting:mocha', 'vulcan:core']);
  api.mainModule('./test/client/index.js', 'client');
  api.mainModule('./test/server/index.js', 'server');
});
