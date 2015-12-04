Package.describe({
  name: "telescope:invites",
  summary: "Telescope invites package",
  version: "0.25.5",
  git: "https://github.com/TelescopeJS/telescope-invites.git"
});

Npm.depends({
  // NPM package dependencies
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  // --------------------------- 1. Meteor packages dependencies ---------------------------

  // automatic (let the package specify where it's needed)

  api.use(['telescope:core@0.25.5']);

  // client

  api.use([
    'jquery',
    'underscore',
    'templating'
  ], ['client']);

  // server

  api.use([
    //
  ], ['server']);

  // ---------------------------------- 2. Files to include ----------------------------------

  // i18n config (must come first)

  api.addFiles([
    'package-tap.i18n'
  ], ['client', 'server']);

  // both

  api.addFiles([
    'lib/invites.js'
  ], ['client', 'server']);

  // client

  api.addFiles([
    'lib/client/templates/user_invites.html',
    'lib/client/templates/user_invites.js'
  ], ['client']);

  // server

  api.addFiles([
    'lib/server/invites.js',
    'lib/server/publications.js'
  ], ['server']);

  // i18n languages (must come last)

  var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);

  // -------------------------------- 3. Variables to export --------------------------------

  api.export("Invites");

});
