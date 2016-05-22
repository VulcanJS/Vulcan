Package.describe({
  name: 'nova:lib',
  summary: 'Telescope libraries.',
  version: '0.26.2-nova',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  var packages = [
    'meteor-base@1.0.4',
    'mongo',
    'tracker',
    'service-configuration',
    'standard-minifiers@1.0.5',
    'modules@0.5.2',
    'accounts-base',
    'check',
    'http',
    'email',
    'tracker',
    'ecmascript@0.4.2',
    'react-meteor-data@0.2.8',
    'aldeed:simple-schema@1.5.3',
    'aldeed:collection2@2.9.1',
    'meteorhacks:picker@1.0.3',
    'dburles:collection-helpers@1.0.4',
    'matb33:collection-hooks@0.8.1',
    'chuangbo:marked@0.3.5_1',
    'percolatestudio:synced-cron@1.1.0',
    'momentjs:moment@2.12.0',
    'djedi:sanitize-html@1.11.2',
    'jparker:gravatar@0.4.1',
    'ongoworks:speakingurl@9.0.0',
    'tmeasday:publish-counts@0.7.3',
    'meteorhacks:unblock@1.1.0',
    'kadira:flow-router-ssr@3.12.2',
    'utilities:smart-publications@0.1.4',
    'utilities:smart-methods@0.1.4',
    'meteorhacks:inject-initial@1.0.4'
  ];

  api.use(packages);

  api.imply(packages);

  api.addFiles([
    'lib/config.js',
    'lib/utils.js',
    'lib/callbacks.js',
    'lib/settings.js',
    'lib/collections.js',
    'lib/deep.js',
    'lib/deep_extend.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/server-config.js'
  ], ['server']);

  api.export([
    'Telescope',
    'Counts'
  ]);

});
