Package.describe({
  name: "telescope:releases",
  summary: "Show Telescope release notes and phone home with some stats.",
  version: "0.25.5",
  git: "https://github.com/TelescopeJS/telescope-releases.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  // --------------------------- 1. Meteor packages dependencies ---------------------------

  api.use(['telescope:core@0.25.5']);

  // ---------------------------------- 2. Files to include ----------------------------------

  // i18n config (must come first)

  api.addFiles([
    'package-tap.i18n'
  ], ['client', 'server']);

  // both

  api.addFiles([
    'lib/releases.js',
  ], ['client', 'server']);

  // client

  api.addFiles([
    'lib/client/templates/current_release.html',
    'lib/client/templates/current_release.js'
  ], ['client']);

  // server

  api.addFiles([
    'lib/server/publications.js',
    'lib/server/import_releases.js'
  ], ['server']);


  api.addAssets('releases/0.25.5.md', 'server');

  // i18n languages (must come last)

  var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);

  // -------------------------------- 3. Variables to export --------------------------------

  api.export([
    'Releases'
  ]);

});
