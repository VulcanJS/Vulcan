Package.describe({
  name: "telescope:search",
  summary: "Telescope search package",
  version: "0.23.0",
  git: "https://github.com/TelescopeJS/telescope-pages.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['telescope:core@0.23.0']);

  api.addFiles([
    'lib/search.js',
    'package-tap.i18n'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/routes.js',
    'lib/client/templates/search.html',
    'lib/client/templates/search.js',
    'lib/client/templates/search_logs.html',
    'lib/client/templates/search_logs.js',
    'lib/client/stylesheets/search.scss'
    ], ['client']);

  api.addFiles([
    'lib/server/log_search.js',
    'lib/server/publications.js'
    ], ['server']);

  var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "it", "ja", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sv", "th", "tr", "vi", "zh-CN"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);

});
