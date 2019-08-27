Package.describe({
  name: 'vulcan:i18n',
  summary: 'i18n client polyfill',
  version: '1.13.2',
  git: 'https://github.com/VulcanJS/Vulcan',
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  api.use(['vulcan:lib@1.13.2']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});

Package.onTest(function(api) {
  api.use(['ecmascript', 'meteortesting:mocha', 'vulcan:test', 'vulcan:i18n']);
  api.mainModule('./test/index.js');
});
