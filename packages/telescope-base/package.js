Package.describe({summary: "Telescope base package"});

Package.onUse(function (api) {

  api.use(['telescope-i18n', 'telescope-lib', 'aldeed:simple-schema', 'check']);
  api.imply(['aldeed:simple-schema']);

  api.add_files(['lib/base.js'], ['client', 'server']);
  api.add_files(['lib/base_client.js'], ['client']);
  api.add_files(['lib/base_server.js'], ['server']);

  api.export([
    'postStatuses',
    'STATUS_PENDING',
    'STATUS_APPROVED',
    'STATUS_REJECTED',
    
    'adminMenu', 
    'viewsMenu', 
    'addToPostSchema', 
    'addToCommentsSchema', 
    'addToSettingsSchema', 
    'addToUserSchema',
    'preloadSubscriptions', 
    'primaryNav', 
    'secondaryNav', 
    'viewParameters',
    'footerModules',
    'heroModules',
    'threadModules',
    'postModules',
    'postThumbnail',
    'postHeading',
    'postMeta',
    'modulePositions',

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
    
    'userEditRenderedCallbacks',
    'userEditClientCallbacks',
    'userProfileCompleteChecks',
    'userProfileDisplay',
    'userProfileEdit',
    'userCreatedCallbacks',
    
    'getTemplate',
    'templates',

    'themeSettings'
    ]);
});
