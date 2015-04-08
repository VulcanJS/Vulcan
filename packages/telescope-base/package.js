Package.describe({summary: "Telescope base package"});

Package.onUse(function (api) {

  api.use(['telescope-i18n', 'telescope-lib', 'aldeed:simple-schema', 'check']);
  api.imply(['aldeed:simple-schema']);

  api.add_files(['lib/base.js'], ['client', 'server']);
  api.add_files(['lib/colors.js'], ['client', 'server']);
  api.add_files(['lib/icons.js'], ['client', 'server']);

  api.export([
    'postStatuses',
    'STATUS_PENDING',
    'STATUS_APPROVED',
    'STATUS_REJECTED',

    'adminMenu',
    'viewsMenu',
    'userMenu',

    'addToPostSchema', 
    'addToCommentsSchema', 
    'addToSettingsSchema', 
    'addToUserSchema',
    
    'registerPostProperty',
    'registerCommentProperty',
    'registerSetting',
    'registerUserProperty',

    'preloadSubscriptions', 
    'primaryNav', 
    'secondaryNav', 
    'mobileNav',
    'viewParameters',

    'footerModules',
    'heroModules',
    'threadModules',
    'postListTopModules',
    'postModules',
    'postThumbnail',
    'postHeading',
    'postMeta',

    'postClassCallbacks',

    'postSubmitRenderedCallbacks',
    'postSubmitClientCallbacks',
    'postSubmitMethodCallbacks',
    'postAfterSubmitMethodCallbacks',

    'postApproveCallbacks',

    'postEditRenderedCallbacks',
    'postEditClientCallbacks',
    'postEditMethodCallbacks',
    'postAfterEditMethodCallbacks',

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

    'userEditRenderedCallbacks',
    'userEditClientCallbacks',
    'userProfileCompleteChecks',
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
