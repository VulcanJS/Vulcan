Package.describe({summary: "Telescope base package"});

Package.onUse(function (api) {

  api.use(['telescope-i18n', 'telescope:telescope-lib', 'telescope:telescope-posts', 'aldeed:simple-schema', 'check']);
  api.imply(['aldeed:simple-schema']);

  api.add_files(['lib/base.js'], ['client', 'server']);
  api.add_files(['lib/colors.js'], ['client', 'server']);
  api.add_files(['lib/icons.js'], ['client', 'server']);

  api.export([

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
