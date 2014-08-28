Package.describe({summary: "Telescope search package"});

Package.onUse(function (api) {

  api.use(['telescope-lib', 'telescope-base', 'aldeed:simple-schema'], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'iron:router',
    'templating'
  ], 'client');

  api.add_files(['lib/search.js'], ['client', 'server']);

  api.add_files([
    'lib/client/routes.js',
    'lib/client/views/search.html',
    'lib/client/views/search.js',
    'lib/client/css/search.css',
    'lib/client/views/search_logs.html',
    'lib/client/views/search_logs.js'
    ], ['client']);

  api.add_files([
    'lib/server/log_search.js',
    'lib/server/publications.js'
    ], ['server']);
  
  api.export(['adminNav', 'viewParameters']);
});