Package.describe({
  name: 'telescope:lib',
  summary: 'Telescope libraries.',
  version: '0.3.1'
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);
  
  api.use([
    'standard-app-packages',
    'accounts-base',
    'accounts-base',
    'accounts-password',
    'accounts-twitter',
    'http',
    'aldeed:simple-schema@1.3.2',
    'aldeed:collection2@2.3.3',
    'aldeed:autoform@5.1.2',
    'tap:i18n@1.4.1',
    'fourseven:scss@2.1.1',
    'iron:router@1.0.5',
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
    'bengott:avatar@0.7.6',
    'fortawesome:fontawesome@4.3.0',
    'ccan:cssreset@1.0.0'
  ]);

  api.imply([ // make the following packages available to the other core packages
    'standard-app-packages',
    'accounts-base',
    'accounts-base',
    'accounts-password',
    'accounts-twitter',
    'http',
    'aldeed:simple-schema@1.3.2',
    'aldeed:collection2@2.3.3',
    'aldeed:autoform@5.1.2',
    'tap:i18n@1.4.1',
    'fourseven:scss@2.1.1',
    'iron:router@1.0.5',
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
    'bengott:avatar@0.7.6',
    'fortawesome:fontawesome@4.3.0'
  ]);

  api.addFiles([
    'lib/core.js',
    'lib/utils.js',
    'lib/config.js',
    'lib/deep.js',
    'lib/deep_extend.js',
    'lib/autolink.js',
    'lib/themes.js',
    'lib/alias.js',
    'lib/base.js',
    'lib/colors.js',
    'lib/icons.js'
  ], ['client', 'server']);

  api.addFiles(['lib/client/jquery.exists.js'], ['client']);

  api.export([
    'Telescope',
    'T',
    '_',

    'addToCommentsSchema',
    'registerCommentProperty',

    'viewParameters',

    'footerModules',
    'heroModules',
    'threadModules',
    'postListTopModules',
    'postModules',
    'postThumbnail',
    'postHeading',
    'postMeta',

    'postSubmitRenderedCallbacks',
    'postEditRenderedCallbacks',

    'commentClassCallbacks',

    'commentSubmitRenderedCallbacks',
    'commentSubmitClientCallbacks',
    'commentSubmitMethodCallbacks',
    'commentAfterSubmitMethodCallbacks',

    'commentEditRenderedCallbacks',
    'commentEditClientCallbacks',
    'commentEditMethodCallbacks',
    'commentAfterEditMethodCallbacks',

    'upvoteCallbacks',
    'downvoteCallbacks',
    'cancelUpvoteCallbacks',
    'cancelDownvoteCallbacks',
    'upvoteMethodCallbacks',
    'downvoteMethodCallbacks',
    'cancelUpvoteMethodCallbacks',
    'cancelDownvoteMethodCallbacks',

    'userEditClientCallbacks',
    'userProfileCompleteChecks',
    'userProfileCompletedCallbacks',

    'userProfileDisplay',
    'userProfileEdit',
    'userCreatedCallbacks',

    'getTemplate',
    'templates',

    'getIcon',
    'icons',

    'colorTable',
    'registerElementColor',

    'themeSettings',

    'getVotePower'
  ]);

});
