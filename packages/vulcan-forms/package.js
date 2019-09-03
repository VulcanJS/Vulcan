Package.describe({
  name: 'vulcan:forms',
  summary: 'Form containers for React',
  version: '1.13.2',
  git: 'https://github.com/meteor-utilities/react-form-containers.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  api.use(['vulcan:core@1.13.2']);

  api.mainModule('lib/client/main.js', ['client']);
  api.mainModule('lib/server/main.js', ['server']);
});

Package.onTest(function(api) {
  api.use(['ecmascript', 'meteortesting:mocha', 'vulcan:test', 'vulcan:forms']);
  api.mainModule('./test/index.js');
});
