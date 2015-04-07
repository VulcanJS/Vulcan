Package.describe({
  summary: 'Auto post via RSS to Telescope',
  version: '0.0.1',
  name: 'telescope-post-by-feed'
});

Npm.depends({
  'feedparser': '1.0.0',
  'to-markdown': '0.0.2',
  'he': '0.5.0',
  'iconv-lite': '0.4.7'
});

Package.onUse(function(api) {

  api.use([
    'telescope-base',
    'telescope-tags',
    'aldeed:simple-schema',
    'aldeed:autoform',
    'tap:i18n',
    'fourseven:scss',
  ], ['client', 'server']);

  api.use([
    'iron:router',
    'templating',
    'telescope-messages'
  ], 'client');

  api.use([
    'http',
    'aldeed:http@0.2.2',
    'momentjs:moment',
    'percolatestudio:synced-cron'
  ], 'server');

  api.addFiles([
    'lib/feeds.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/routes.js',
    'lib/client/scss/feeds.scss',
    'lib/client/templates/feeds.js',
    'lib/client/templates/feeds.html',
    'lib/client/templates/feed_item.js',
    'lib/client/templates/feed_item.html',
  ], 'client');

  api.addFiles([
    'lib/server/fetch_feeds.js',
    'lib/server/cron.js',
    'lib/server/publications.js'
  ], ['server']);

  api.addFiles([
    "i18n/en.i18n.json"
  ], ["client", "server"]);

  api.export([
    'Feeds'
  ]);
});

Package.onTest(function(api) {
  api.use('tinytest');
});
