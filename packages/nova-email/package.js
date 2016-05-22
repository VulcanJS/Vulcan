Package.describe({
  name: "nova:email",
  summary: "Telescope email package",
  version: "0.26.2-nova",
  git: "https://github.com/TelescopeJS/telescope-email.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:core@0.26.2-nova'
  ]);

  // do not use for now since tap:i18n doesn't support server-side templates yet
  // api.addFiles([
  //   'package-tap.i18n'
  // ], ['client', 'server']);

  api.addFiles([
    'lib/namespace.js'
  ], ['client', 'server']);

  api.mainModule('lib/server/email.js', ['server']);

  // var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  // var languagesPaths = languages.map(function (language) {
  //   return "i18n/"+language+".i18n.json";
  // });
  // api.addFiles(languagesPaths, ["client", "server"]);

});
