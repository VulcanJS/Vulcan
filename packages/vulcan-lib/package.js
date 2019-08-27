Package.describe({
  name: 'vulcan:lib',
  summary: 'Vulcan libraries.',
  version: '1.13.2',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function (api) {
  api.versionsFrom('1.6.1');

  // note: if used, accounts-base should be loaded before vulcan:lib
  api.use('accounts-base', { weak: true });

  var packages = [
    'buffer@0.0.0', // see https://github.com/meteor/meteor/issues/8645

    // Minimal Meteor packages

    'meteor@1.9.3',
    'static-html@1.2.2',
    'standard-minifier-css@1.5.3',
    'standard-minifier-js@2.4.1',
    'es5-shim@4.8.0',
    'ecmascript@0.12.4',
    'shell-server@0.4.0',
    'webapp@1.7.3',
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
    'apollo@3.0.1',

    // Third-party packages

    // 'aldeed:collection2-core@2.0.0',
    'meteorhacks:picker@1.0.3',
    'littledata:synced-cron@1.5.1',
    'meteorhacks:inject-initial@1.0.4',
  ];

  api.use(packages);

  api.imply(packages);

  api.export(['Vulcan']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});

Package.onTest(function (api) {
  api.use(['ecmascript', 'meteortesting:mocha', 'vulcan:test', 'vulcan:lib']);
  api.mainModule('./test/client/index.js', 'client');
  api.mainModule('./test/server/index.js', 'server');
});
