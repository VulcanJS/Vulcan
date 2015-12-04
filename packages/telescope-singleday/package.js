Package.describe({
  name: 'telescope:singleday',
  summary: 'Telescope Single Day package',
  version: '0.25.5',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Npm.depends({
  // NPM package dependencies
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
    'lib/singleday.js'
  ], ['client', 'server']);

  // client

  api.addFiles([
    'lib/client/templates/single_day.html',
    'lib/client/templates/single_day.js',
    'lib/client/templates/single_day_nav.html',
    'lib/client/templates/single_day_nav.js'
  ], ['client']);

  // server

  api.addFiles([
  ], ['server']);

  // i18n languages (must come last)

  var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);

});
