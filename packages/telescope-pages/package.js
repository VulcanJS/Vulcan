Package.describe({
  name: "telescope:pages",
  summary: "Telescope static pages package",
  version: "0.25.5",
  git: "https://github.com/TelescopeJS/telescope-pages.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  api.use(['telescope:core@0.25.5']);

  api.addFiles([
    'lib/pages.js',
    'lib/routes.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/stylesheets/pages.scss',
    'lib/client/templates/page.html',
    'lib/client/templates/page.js',
    'lib/client/templates/page_item.html',
    'lib/client/templates/page_item.js',
    'lib/client/templates/pages.html',
    'lib/client/templates/pages.js',
    'lib/client/templates/pages_menu.html',
    'lib/client/templates/pages_menu.js'
  ], 'client');

  api.addFiles([
    'lib/server/publications.js'
  ], ['server']);

  var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);

  api.export([
    'Pages'
  ]);
});
