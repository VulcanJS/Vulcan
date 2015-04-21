Package.describe({
  name: 'telescope:lib',
  summary: 'Telescope libraries.',
  version: '0.3.1'
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);
  
  api.use([
    'jquery',
    'underscore',
    'check',
    'aldeed:simple-schema@1.3.2'
  ]);

  // api.use(['telescope-i18n']);

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
