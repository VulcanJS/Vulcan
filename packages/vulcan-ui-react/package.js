Package.describe({
  name: 'vulcan:ui-react',
  summary: 'Common UI API and helpers',
  version: '1.13.0',
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  api.use(['vulcan:core@1.13.0']);

  api.mainModule('lib/client/main.js', ['client']);
  api.mainModule('lib/server/main.js', ['server']);
});

Package.onTest(function(api) {
  api.use(['ecmascript', 'meteortesting:mocha', 'vulcan:test','vulcan:ui-react']);
  api.mainModule('./test/index.js');
});
