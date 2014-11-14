Package.describe({summary: "Telescope daily view"});

Package.onUse(function (api) {

  api.use(['telescope-lib', 'telescope-base', 'meteorhacks:fast-render', 'meteorhacks:subs-manager'], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'iron:router',
    'templating'
  ], 'client');

  api.add_files(['lib/daily.js'], ['client', 'server']);

  api.add_files([
    'lib/client/routes.js',
    'lib/client/templates/posts_daily.html',
    'lib/client/templates/posts_daily.js',
    'lib/client/stylesheets/daily.css',
    ], ['client']);

  api.add_files(['lib/server/publications.js'], ['server']);
 
  api.export(['PostsDailyController']);
});