Package.describe({
  name: 'meteortesting:mocha',
  summary: 'Run Meteor package or app tests with Mocha',
  git: 'https://github.com/meteortesting/meteor-mocha.git',
  documentation: '../README.md',
  version: '1.1.3',
  testOnly: true,
});

Package.onUse(function onUse(api) {
  api.use([
    'meteortesting:mocha-core@6.1.2',
    'ecmascript@0.3.0',
    'lmieulet:meteor-coverage@3.2.0',
  ]);

  api.use(['meteortesting:browser-tests@1.2.0', 'http@1.4.2'], 'server');
  api.use('browser-policy@1.1.0', 'server', { weak: true });

  api.mainModule('client.js', 'client');
  api.mainModule('server.js', 'server');
});
