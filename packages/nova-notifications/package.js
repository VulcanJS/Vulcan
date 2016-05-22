Package.describe({
  name: "nova:notifications",
  summary: "Telescope notifications package",
  version: "0.26.2-nova",
  git: "https://github.com/TelescopeJS/telescope-notifications.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.26.2-nova',
    'nova:email@0.26.2-nova',
    'nova:users@0.26.2-nova'
    // 'kestanous:herald@1.3.0',
    // 'kestanous:herald-email@0.5.0'
  ]);

  api.addFiles([
    'lib/notifications.js',
    'lib/custom_fields.js'
    // 'package-tap.i18n'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/notifications-server.js'
  ], ['server']);

  // var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  // var languagesPaths = languages.map(function (language) {
  //   return "i18n/"+language+".i18n.json";
  // });
  // api.addFiles(languagesPaths, ["client", "server"]);

});

// TODO: once user profile edit form is generated dynamically, add notification options from this package as well.
