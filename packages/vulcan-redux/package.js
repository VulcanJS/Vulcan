Package.describe({
  name: 'vulcan:redux',
  summary: 'Add Redux to Vulcan.',
  version: '1.12.8',
  git: 'https://github.com/VulcanJS/Vulcan.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  var packages = [
    'vulcan:core@1.12.8',
  ];

  api.use(packages);

  api.imply(packages);

  api.export(['Vulcan']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});

Package.onTest(function(api) {
  api.use(['ecmascript', 'meteortesting:mocha', 'vulcan:lib']);
  api.mainModule('./test/index.js');
  api.mainModule('./test/server/index.js', 'server');
});
