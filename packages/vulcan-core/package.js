Package.describe({
  name: 'vulcan:core',
  summary: 'Vulcan core package',
  version: '1.15.0',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  api.use(['vulcan:lib@=1.15.0', 'vulcan:i18n@=1.15.0', 'vulcan:users@=1.15.0', 'vulcan:debug@=1.15.0']);

  api.imply(['vulcan:lib@=1.15.0']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});

Package.onTest(function(api) {
  api.use(['ecmascript', 'meteortesting:mocha', 'vulcan:core', 'vulcan:test', 'vulcan:users']);
  api.mainModule('./test/server/index.js', ['server']);
  api.mainModule('./test/client/index.js', ['client']);
});
