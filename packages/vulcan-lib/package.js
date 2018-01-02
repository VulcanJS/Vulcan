Package.describe({
  name: 'vulcan:lib',
  summary: 'Vulcan libraries.',
  version: '1.8.2',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom('METEOR@1.6');

  var packages = [

    'buffer@0.0.0', // see https://github.com/meteor/meteor/issues/8645

    // Meteor packages

    'meteor-base',
    'mongo',
    'tracker',
    'service-configuration',
    'standard-minifiers',
    'modules',
    'accounts-base',
    'check',
    'http',
    'email',
    'random',
    'ecmascript',
    'service-configuration',
    'shell-server',

    // Third-party packages

    // 'aldeed:collection2-core@2.0.0',
    'meteorhacks:picker@1.0.3',
    'percolatestudio:synced-cron@1.1.0',
    'meteorhacks:inject-initial@1.0.4',
  ];

  api.use(packages);

  api.imply(packages);

  api.export([
    'Vulcan'
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
