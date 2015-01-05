Package.describe({
  summary: 'Auto post via RSS to Telescope',
  version: '0.0.1',
  name: 'telescope-post-by-feed'
});

Npm.depends({
  'htmlparser2': '3.8.2',
  'to-markdown': '0.0.2',
  'he': '0.5.0'
});

Package.onUse(function(api) {

  api.use([
    'telescope-base', 
    'aldeed:simple-schema',
    'aldeed:autoform',
    'tap:i18n',
    'fourseven:scss',
  ], ['client', 'server']);

  api.use([
    'iron:router',
    'templating'
  ], 'client');

  api.use([
    'http',
    'mrt:moment',
    'percolatestudio:synced-cron'
  ], 'server');

  api.add_files([
    'lib/feeds.js'
  ], ['client', 'server']);

  api.add_files([
    'lib/client/routes.js',
    'lib/client/scss/feeds.scss',
    'lib/client/templates/feeds.js',
    'lib/client/templates/feeds.html',
    'lib/client/templates/feed_item.js',
    'lib/client/templates/feed_item.html',
  ], 'client');

  api.add_files([
    'lib/server/fetch_feeds.js',
    'lib/server/cron.js',
    'lib/server/publications.js'
  ], ['server']);

  api.add_files([
    "i18n/en.i18n.json"
  ], ["client", "server"]);

  api.export([
    'Feeds'
  ]);
});

Package.onTest(function(api) {
  api.use('tinytest');
});
