Package.describe({
  name: "telescope:tagline-banner",
  summary: "Show a banner containing your site's tagline on the homepage",
  version: "0.25.5",
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  // --------------------------- 1. Meteor packages dependencies ---------------------------

  api.use(['telescope:core@0.25.5']);

  // ---------------------------------- 2. Files to include ----------------------------------

  api.addFiles([
    'lib/tagline.js',
    'package-tap.i18n'
  ], ['client', 'server']);

  // client

  api.addFiles([
    'lib/client/templates/tagline_banner.html',
    'lib/client/templates/tagline_banner.js',
    'lib/client/stylesheets/tagline_banner.scss'
  ], ['client']);

  var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);

});
