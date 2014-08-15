Package.describe({summary: "Telescope library package"});

Package.on_use(function (api) {

  api.use([
    'underscore'
  ], ['client', 'server']);

  api.use([
    'jquery'
  ], 'client');

  api.add_files(['lib/lib.js', 'lib/deep_extend.js', 'lib/autolink.js'], ['client', 'server']);

  api.add_files(['lib/client/jquery.exists.js'], ['client']);
  
  api.export([
    'deepExtend', 
    'camelToDash',
    'dashToCamel',
    'getSetting',
    'getThemeSetting',
    'getSiteUrl',
    'trimWords'
  ]);
});