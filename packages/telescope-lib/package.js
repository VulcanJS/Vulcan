Package.describe({
  name: 'telescope:lib',
  summary: 'Telescope libraries.',
  version: '0.23.1',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);
  
  var packages = [
    'standard-app-packages',
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
    'spiderable',
    'aldeed:simple-schema@1.3.3',
    'aldeed:collection2@2.3.3',
    'aldeed:http@0.2.2',
    'aldeed:autoform@5.4.0',
    'aldeed:template-extension@3.4.3',
    'tap:i18n@1.5.1',
    'fourseven:scss@3.2.0',
    'iron:router@1.0.9',
    'dburles:collection-helpers@1.0.3',
    // 'meteorhacks:flow-router@1.5.0',
    // 'meteorhacks:flow-layout@1.1.1',
    'matb33:collection-hooks@0.7.13',
    'chuangbo:marked@0.3.5',
    'meteorhacks:fast-render@2.7.1',
    'meteorhacks:subs-manager@1.5.2',
    'percolatestudio:synced-cron@1.1.0',
    'useraccounts:unstyled@1.11.1',
    'manuelschoebel:ms-seo@0.4.1',
    'aramk:tinycolor@1.1.0_1',
    'momentjs:moment@2.10.6',
    'sacha:spin@2.3.1',
    'aslagle:reactive-table@0.8.11',
    'utilities:avatar@0.8.2',
    'fortawesome:fontawesome@4.3.0',
    'ccan:cssreset@1.0.0',
    'djedi:sanitize-html@1.7.0',
    'dburles:collection-helpers@1.0.3',
    'jparker:gravatar@0.3.1',
    'sanjo:meteor-files-helpers@1.1.0_7',
    'cmather:handlebars-server@2.0.0',
    'chuangbo:cookie@1.1.0',
    'ongoworks:speakingurl@5.0.1',
    'okgrow:iron-router-autoscroll@0.0.8'
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
    'lib/base.js',
    'lib/colors.js',
    'lib/icons.js'
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
