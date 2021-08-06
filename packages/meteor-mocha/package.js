Package.describe({
  name: 'meteortesting:mocha',
  summary: 'Run Meteor package or app tests with Mocha',
  git: 'https://github.com/meteortesting/meteor-mocha.git',
  documentation: '../README.md',
  version: '2.0.2',
  testOnly: true,
});

Package.onUse(function onUse(api) {
  api.use([
    'meteortesting:mocha-core@8.1.2',
    'ecmascript@0.3.0',
    'lmieulet:meteor-coverage@4.0.0',
  ]);

  api.use(['meteortesting:browser-tests@1.3.4', 'http@2.0.0'], 'server');
  api.use('browser-policy@1.1.0', 'server', { weak: true });

  api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server');
});
