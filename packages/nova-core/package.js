Package.describe({
  name: "nova:core",
  summary: "Telescope core package",
  version: "0.26.2-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  var packages = [
    'nova:lib@0.26.2-nova', //  no dependencies
    // 'nova:messages@0.26.2-nova', // lib
    'nova:i18n@0.26.2-nova', // lib
    'nova:events@0.26.2-nova' // lib, i18n
  ];

  api.use(packages);
  
  api.imply(packages);

  api.addFiles([
    'lib/callbacks.js',
    'lib/icons.js',
    'lib/seo.js',
    'lib/debug.js',
    'lib/router.jsx',
    // 'lib/colors.js' // probably not that useful anymore?
  ], ['client', 'server']);

  api.addAssets([
    // 'public/img/loading.svg',
  ], 'client');

  api.addFiles([
    'lib/server/start.js',
    'lib/server/routes.js'
  ], ['server']);

  api.mainModule("lib/core.js", ["client", "server"]);

  // var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  // var languagesPaths = languages.map(function (language) {
  //   return "i18n/"+language+".i18n.json";
  // });
  // api.addFiles(languagesPaths, ["client", "server"]);

  // api.export([
  //   'Messages'
  // ]);

});
