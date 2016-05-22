Package.describe({
  name: "nova:kadira",
  summary: "Telescope Kadira package",
  version: "0.26.2-nova",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:core@0.26.2-nova',
    'meteorhacks:kadira@2.28.5',
    'kadira:debug@3.2.2'
  ], ['client', 'server']);

  api.addFiles([
    // 'package-tap.i18n',
    'lib/kadira-settings.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/kadira.js'
  ], ['server']);

  // var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  // var languagesPaths = languages.map(function (language) {
  //   return "i18n/"+language+".i18n.json";
  // });
  // api.addFiles(languagesPaths, ["client", "server"]);

});
