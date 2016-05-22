Package.describe({
  name: "nova:settings",
  summary: "Telescope settings package – only necessary if you're storing settings in a collection",
  version: "0.26.2-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:lib@0.26.2-nova',
    'nova:users@0.26.2-nova'
    // 'nova:i18n@0.26.2-nova'
  ]);

  api.addFiles([
    'lib/collection.js',
    'lib/init.js',
    'lib/methods.js',
    // 'package-tap.i18n'
  ], ['server', 'client']);

  api.addFiles([
    'lib/server/publications.js',
  ], 'server');

  // var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  // var languagesPaths = languages.map(function (language) {
  //   return "i18n/"+language+".i18n.json";
  // });
  // api.addFiles(languagesPaths, ["client", "server"]);

});
