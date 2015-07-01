Package.describe({
  name: 'telescope:lib',
  summary: 'Telescope libraries.',
  version: '0.21.1',
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
    'reactive-var',
    'http',
    'email',
    'spiderable',
    'aldeed:simple-schema@1.3.3',
    'aldeed:collection2@2.3.3',
    'sacha:autoform@5.1.2',
    'aldeed:template-extension@3.4.3',
    'tap:i18n@1.5.0',
    'fourseven:scss@2.1.1',
    'iron:router@1.0.9',
    'dburles:collection-helpers@1.0.3',
    // 'meteorhacks:flow-router@1.5.0',
    // 'meteorhacks:flow-layout@1.1.1',
    'matb33:collection-hooks@0.7.11',
    'chuangbo:marked@0.3.5',
    'meteorhacks:fast-render@2.3.2',
    'meteorhacks:subs-manager@1.3.0',
    'percolatestudio:synced-cron@1.1.0',
    'useraccounts:unstyled@1.8.1',
    'manuelschoebel:ms-seo@0.4.1',
    'aramk:tinycolor@1.1.0_1',
    'momentjs:moment@2.10.3',
    'sacha:spin@0.2.4',
    'aslagle:reactive-table@0.7.3',
    'utilities:avatar@0.7.12',
    'fortawesome:fontawesome@4.3.0',
    'ccan:cssreset@1.0.0',
    'djedi:sanitize-html@1.6.1',
    'dburles:collection-helpers@1.0.3',
    'jparker:gravatar@0.3.1',
    'sanjo:meteor-files-helpers@1.1.0_4',
    'cmather:handlebars-server@0.2.0',
    'chuangbo:cookie@1.1.0',
    'ongoworks:speakingurl@5.0.1'
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
