Package.describe({
  name: 'telescope:lib',
  summary: 'Telescope libraries.',
  version: '0.25.7',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);
  
  var packages = [
    'meteor-base@1.0.1',
    'mongo',
    'blaze-html-templates@1.0.1',
    'jquery',
    'session',
    'tracker',
    // 'standard-minifiers@1.0.1',
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
    'ecmascript@0.1.6',
    'aldeed:simple-schema@1.5.3',
    'aldeed:collection2@2.8.0',
    'aldeed:http@0.2.2',
    'aldeed:autoform@5.8.1',
    'aldeed:template-extension@4.0.0',
    'tap:i18n@1.7.0',
    'fourseven:scss@3.4.1',
    'kadira:flow-router@2.10.1',
    'kadira:blaze-layout@2.3.0',
    'arillo:flow-router-helpers@0.5.0',
    'meteorhacks:picker@1.0.3',
    'kadira:dochead@1.4.0',
    'dburles:collection-helpers@1.0.4',
    'matb33:collection-hooks@0.8.1',
    'chuangbo:marked@0.3.5_1',
    'meteorhacks:fast-render@2.11.0',
    'meteorhacks:subs-manager@1.6.3',
    'percolatestudio:synced-cron@1.1.0',
    'useraccounts:unstyled@1.13.1',
    'useraccounts:flow-routing@1.13.1',
    'aramk:tinycolor@1.1.0_1',
    'momentjs:moment@2.11.2',
    'sacha:spin@2.3.1',
    'aslagle:reactive-table@0.8.24',
    'utilities:avatar@0.9.2',
    'fortawesome:fontawesome@4.5.0',
    'ccan:cssreset@1.0.0',
    'djedi:sanitize-html@1.11.2',
    'dburles:collection-helpers@1.0.4',
    'jparker:gravatar@0.4.1',
    'sanjo:meteor-files-helpers@1.2.0_1',
    'cmather:handlebars-server@2.0.0',
    'chuangbo:cookie@1.1.0',
    'ongoworks:speakingurl@6.0.0',
    'okgrow:router-autoscroll@0.1.6',
    'tmeasday:publish-counts@0.7.3',
    'utilities:onsubscribed@0.1.2',
    'utilities:menu@0.1.6',
    'seba:minifiers-autoprefixer@0.0.1',
    'dburles:spacebars-tohtml@1.0.1',
    'meteorhacks:unblock@1.1.0'
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
    'lib/custom_template_prefix.js'
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

    'themeSettings'
  ]);

});
