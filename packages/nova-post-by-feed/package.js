Package.describe({
  name: "nova:post-by-feed",
  summary: "Auto post via RSS to Telescope",
  version: "0.26.1-nova",
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

  api.use([
    'nova:core@0.26.1-nova',
    'nova:lib@0.26.1-nova',
    'nova:posts@0.26.1-nova',
    'nova:users@0.26.1-nova',
    'nova:settings@0.26.1-nova',
  ]);

  api.addFiles([
    'lib/collection.js',
    'lib/custom_fields.js',
    'lib/methods.js',
  ], ['client', 'server']);

  

  api.addFiles([
    'lib/server/fetch_feeds.js',
    'lib/server/cron.js',
    'lib/server/publications.js',
  ], ['server']);

  // var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  // var languagesPaths = languages.map(function (language) {
  //   return "i18n/"+language+".i18n.json";
  // });
  // api.addFiles(languagesPaths, ["client", "server"]);

  api.export([
    'Feeds'
  ]);
});
