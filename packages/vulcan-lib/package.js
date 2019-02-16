Package.describe({
  name: 'vulcan:lib',
  summary: 'Vulcan libraries.',
  version: '1.12.16',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  // note: if used, accounts-base should be loaded before vulcan:lib
  api.use('accounts-base', { weak: true });

  var packages = [
    'buffer@0.0.0', // see https://github.com/meteor/meteor/issues/8645

    // Minimal Meteor packages

    'meteor@1.9.0',
    'static-html@1.2.2',
    'standard-minifier-css@1.4.1',
    'standard-minifier-js@2.3.4',
    'es5-shim@4.8.0',
    'ecmascript@0.11.0',
    'shell-server@0.3.1',
    'webapp@1.6.0',
    'server-render@0.3.1',

    // Other meteor-base package
    // see https://github.com/meteor/meteor/blob/master/packages/meteor-base/package.js

    'underscore',
    'hot-code-push',
    // 'ddp',

    // Other packages

    'mongo',
    'check',
    'http',
    'email',
    'random',

    // Third-party packages

    // 'aldeed:collection2-core@2.0.0',
    'meteorhacks:picker@1.0.3',
    'percolatestudio:synced-cron@1.1.0',
    'meteorhacks:inject-initial@1.0.4',
  ];

  api.use(packages);

  api.imply(packages);

  api.export(['Vulcan']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});

Package.onTest(function(api) {
  api.use(['ecmascript', 'meteortesting:mocha']);
  api.mainModule('./test/index.js');
});
