Package.describe({
  name: "telescope:prerender",
  summary: "Telescope Prereder.io package",
  version: "0.25.5",
  git: "https://github.com/TelescopeJS/Telescope"
});

Npm.depends({
  'prerender-node': '2.0.1'
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:core@0.25.5'
  ]);

  api.addFiles([
    'package-tap.i18n',
    'lib/prerender-setting.js'
  ], ['client','server']);

  api.addFiles([
    'lib/server/prerender.js'
  ], ['server']);

  var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);

});
