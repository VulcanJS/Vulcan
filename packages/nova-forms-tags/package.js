Package.describe({
  name: "nova:forms-tags",
  summary: "Telescope tag input package",
  version: "0.26.2-nova",
  git: 'https://github.com/TelescopeJS/telescope.git'
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.26.2-nova',
    'nova:forms@0.26.2-nova'
  ]);

  api.mainModule("lib/export.js", ["client", "server"]);

  // var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  // var languagesPaths = languages.map(function (language) {
  //   return "i18n/"+language+".i18n.json";
  // });
  // api.addFiles(languagesPaths, ["client", "server"]);
  
});
