Package.describe({
  name: 'apollo',
  version: '3.0.0',
  summary: '🚀 Add Apollo to your Meteor app',
  git: 'https://github.com/apollostack/meteor-integration',
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.2');
  api.use(['ecmascript', 'accounts-base', 'check']);

  api.mainModule('src/server.js', 'server');
  api.mainModule('src/client.js', 'client', { lazy: true });
});

Npm.depends({
  'apollo-link': '1.2.2'
})

Package.onTest(function(api) {
  api.use([
    'ecmascript',
    'meteortesting:mocha',
    'practicalmeteor:chai',
    'accounts-base',
    'apollo',
  ]);

  api.mainModule('tests/server.js', 'server');
});
