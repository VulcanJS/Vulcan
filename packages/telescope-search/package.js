Package.describe("Telescope search package");

Package.on_use(function (api) {

  api.use(['telescope-lib', 'telescope-base', 'simple-schema'], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'iron-router',
    'templating'
  ], 'client');

  api.add_files(['lib/search.js'], ['client', 'server']);

  api.add_files([
    'lib/client/routes.js',
    'lib/client/views/search.html',
    'lib/client/views/search.js',
    'lib/client/views/search_logs.html',
    'lib/client/views/search_logs.js'
    ], ['client']);

  api.add_files([
    'lib/server/log_search.js',
    'lib/server/publications.js'
    ], ['server']);
  
  api.export(['adminNav', 'viewParameters']);
});