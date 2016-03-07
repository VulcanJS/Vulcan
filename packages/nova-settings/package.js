Package.describe({
  name: "nova:settings",
  summary: "Telescope settings package – only necessary if you're storing settings in a collection",
  version: "0.25.7",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {
  var both = ['server', 'client'];

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:lib@0.25.7',
    // 'nova:i18n@0.25.7'
  ]);

  api.addFiles([
    'lib/settings.js',
    // 'package-tap.i18n'
  ], both);

  api.addFiles([
    'lib/server/publications.js',
  ], 'server');

  // var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  // var languagesPaths = languages.map(function (language) {
  //   return "i18n/"+language+".i18n.json";
  // });
  // api.addFiles(languagesPaths, ["client", "server"]);

  api.export('Settings', both);
});
