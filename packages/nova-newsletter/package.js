Package.describe({
  name: "nova:newsletter",
  summary: "Telescope email newsletter package",
  version: "0.25.7_1",
  git: "https://github.com/TelescopeJS/telescope-newsletter.git"
});

Npm.depends({
  "html-to-text": "1.3.1"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.25.7',
    'nova:posts@0.25.7',
    'nova:comments@0.25.7',
    'nova:users@0.25.7',
    'nova:email@0.25.7',
    'miro:mailchimp@1.1.0',
  ]);

  api.addFiles([
    // 'package-tap.i18n',
    // 'lib/collection.js',
    'lib/callbacks.js',
    'lib/custom_fields.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/cron.js',
    'lib/server/methods.js'
  ], ['server']);

  api.mainModule(
    'lib/export.js', 
  ['server']);

  // var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  // var languagesPaths = languages.map(function (language) {
  //   return "i18n/"+language+".i18n.json";
  // });
  // api.addFiles(languagesPaths, ["client", "server"]);

});
