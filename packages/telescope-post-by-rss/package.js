Package.describe({
  summary: 'Auto post via RSS to Telescope',
  version: '0.0.1',
  name: 'telescope-post-by-rss'
});

Npm.depends({
  'htmlparser2': '3.8.2',
  'html-to-text': '0.1.0',
});

Package.onUse(function(api) {

  api.use([
    'telescope-base', 
    'aldeed:simple-schema',
    'tap:i18n'
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
    'lib/rssUrls.js'
  ], ['client', 'server']);

  api.add_files([
    'lib/client/routes.js',
    'lib/client/templates/rss_urls.js',
    'lib/client/templates/rss_urls.html',
    'lib/client/templates/rss_url_item.js',
    'lib/client/templates/rss_url_item.html',
  ], 'client');

  api.add_files([
    'lib/server/utils.js',
    'lib/server/cron.js',
    'lib/server/publications.js'
  ], ['server']);

  api.add_files([
    "i18n/en.i18n.json"
  ], ["client", "server"]);
});

Package.onTest(function(api) {
  api.use('tinytest');
});
