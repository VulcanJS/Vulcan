Package.describe({
  name: "nova:newsletter",
  summary: "Telescope email newsletter package",
  version: "0.26.2-nova",
  git: "https://github.com/TelescopeJS/telescope-newsletter.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.26.2-nova',
    'nova:posts@0.26.2-nova',
    'nova:comments@0.26.2-nova',
    'nova:users@0.26.2-nova',
    'nova:email@0.26.2-nova'
  ]);

  api.addFiles([
    // 'package-tap.i18n',
    // 'lib/collection.js',
    'lib/callbacks.js',
    'lib/custom_fields.js',
    'lib/emails.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/cron.js',
    'lib/server/emails.js',
    'lib/server/methods.js',
    'lib/server/mailchimp_api.js'
  ], ['server']);

  api.mainModule('lib/server.js', 'server');
  api.mainModule('lib/client.js', 'client');

  // var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  // var languagesPaths = languages.map(function (language) {
  //   return "i18n/"+language+".i18n.json";
  // });
  // api.addFiles(languagesPaths, ["client", "server"]);

});
