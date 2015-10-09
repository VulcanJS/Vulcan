Package.describe({
  name: 'telescope:lib',
  summary: 'Telescope libraries.',
  version: '0.25.1',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);
  
  var packages = [
    'meteor-base',
    'mongo',
    'blaze-html-templates',
    'jquery',
    'session',
    'tracker',
    'standard-minifiers',
    'service-configuration',
    'accounts-ui',
    'accounts-base',
    'accounts-password',
    'accounts-twitter',
    'accounts-facebook',
    'check',
    // 'audit-argument-checks',
    'reactive-var',
    'http',
    'email',
    'ecmascript@0.1.4',
    'aldeed:simple-schema@1.3.3',
    'aldeed:collection2@2.5.0',
    'aldeed:http@0.2.2',
    'aldeed:autoform@5.5.1',
    'aldeed:template-extension@3.4.3',
    'tap:i18n@1.6.1',
    'fourseven:scss@3.2.0',
    // 'iron:router@1.0.9',
    'kadira:flow-router@2.6.2',
    'kadira:blaze-layout@2.1.0',
    'arillo:flow-router-helpers@0.4.5',
    'meteorhacks:picker@1.0.3',
    'kadira:dochead@1.1.0',
    'dburles:collection-helpers@1.0.3',
    // 'meteorhacks:flow-router@1.5.0',
    // 'meteorhacks:flow-layout@1.1.1',
    'matb33:collection-hooks@0.8.0',
    'chuangbo:marked@0.3.5_1',
    'meteorhacks:fast-render@2.10.0',
    'meteorhacks:subs-manager@1.6.2',
    'percolatestudio:synced-cron@1.1.0',
    'useraccounts:unstyled@1.12.3',
    'useraccounts:flow-routing@1.12.3',
    // 'manuelschoebel:ms-seo@0.4.1',
    // 'tomwasd:flow-router-seo@0.0.3',
    'aramk:tinycolor@1.1.0_1',
    'momentjs:moment@2.10.6',
    'sacha:spin@2.3.1',
    'aslagle:reactive-table@0.8.12',
    'utilities:avatar@0.9.1',
    'fortawesome:fontawesome@4.4.0',
    'ccan:cssreset@1.0.0',
    'djedi:sanitize-html@1.10.0',
    'dburles:collection-helpers@1.0.3',
    'jparker:gravatar@0.4.1',
    'sanjo:meteor-files-helpers@1.1.0_7',
    'cmather:handlebars-server@2.0.0',
    'chuangbo:cookie@1.1.0',
    'ongoworks:speakingurl@5.0.1',
    'okgrow:router-autoscroll@0.1.0',
    // 'utilities:state-transitions@0.1.0',
    'tmeasday:publish-counts@0.7.2',
    // 'dburles:iron-router-query-array@1.0.1'
    'utilities:onsubscribed@0.1.2'
  ];

  api.use(packages);

  api.imply(packages);

  api.addFiles([
    'lib/core.js',
    'lib/utils.js',
    'lib/callbacks.js',
    'lib/collections.js',
    'lib/modules.js',
    'lib/config.js',
    'lib/templates.js',
    'lib/deep.js',
    'lib/deep_extend.js',
    'lib/autolink.js',
    'lib/themes.js',
    'lib/menus.js',
    'lib/seo.js',
    'lib/base.js',
    'lib/colors.js',
    'lib/icons.js',
    'lib/router.js',
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/jquery.exists.js',
    'lib/client/template_replacement.js'
  ], ['client']);

  api.export([
    'Telescope',
    '_',

    'getTemplate',
    'templates',

    'themeSettings',

    'getVotePower'
  ]);

});
