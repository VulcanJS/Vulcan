Package.describe({
  name: 'vulcan:forms',
  summary: 'Form containers for React',
  version: '1.16.2',
  git: 'https://github.com/meteor-utilities/react-form-containers.git',
});

Package.onUse(function(api) {
  api.use(['vulcan:core@=1.16.2']);

  api.mainModule('lib/client/main.js', ['client']);
  api.mainModule('lib/server/main.js', ['server']);
});

Package.onTest(function(api) {
  api.use(['ecmascript', 'meteortesting:mocha', 'vulcan:test', 'vulcan:forms', 'vulcan:ui-bootstrap']);
  api.mainModule('./test/index.js');
});
