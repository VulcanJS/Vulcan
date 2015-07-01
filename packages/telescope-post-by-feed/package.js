Package.describe({
  name: "telescope:post-by-feed",
  summary: "Auto post via RSS to Telescope",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/telescope-post-by-feed.git"
});

Npm.depends({
  'feedparser': '1.0.0',
  'to-markdown': '0.0.2',
  'he': '0.5.0',
  'iconv-lite': '0.4.7'
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['telescope:core@0.21.1']);

  api.use([
    'http',
    'aldeed:http@0.2.2',
    'momentjs:moment@2.10.0',
    'percolatestudio:synced-cron@1.1.0'
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
