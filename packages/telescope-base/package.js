Package.describe({summary: "Telescope base package"});

Package.on_use(function (api) {

  api.use(['telescope-lib'], ['client', 'server']);

  api.add_files(['lib/base.js'], ['client', 'server']);
  api.add_files(['lib/base_client.js'], ['client']);
  api.add_files(['lib/base_server.js'], ['server']);

  api.export([
    'adminNav', 
    'viewNav', 
    'addToPostSchema', 
    'addToCommentsSchema', 
    'addToSettingsSchema', 
    'preloadSubscriptions', 
    'navItems', 
    'viewParameters', 
    'postModules',
    'postHeading',
    'postMeta',
    'modulePositions',

    'postSubmitRenderedCallbacks',
    'postSubmitClientCallbacks',
    'postSubmitServerCallbacks',

    'postEditRenderedCallbacks',
    'postEditClientCallbacks',

    'commentSubmitClientCallbacks',
    'commentSubmitServerCallbacks',
    'commentEditClientCallbacks',
    
    'getTemplate',
    'templates'
    ]);
});