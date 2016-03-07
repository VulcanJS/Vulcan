Package.describe({
  name: "nova:categories",
  summary: "Telescope tags package",
  version: "0.25.7",
  git: "https://github.com/TelescopeJS/telescope-tags.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.25.7',
    'nova:posts@0.25.7',
    'nova:users@0.25.7'
  ]);

  api.addFiles([
    'lib/collection.js',
    'lib/helpers.js',
    'lib/callbacks.js',
    'lib/parameters.js',
    'lib/custom_fields.js',
    'lib/subscriptions.js',
    'lib/methods.js',
    'lib/routes.jsx',
    // 'package-tap.i18n'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/publications.js',
    'lib/server/load_categories.js'
  ], ['server']);

  // var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  // var languagesPaths = languages.map(function (language) {
  //   return "i18n/"+language+".i18n.json";
  // });
  // api.addFiles(languagesPaths, ["client", "server"]);

  api.export([
    'Categories'
  ]);
});
