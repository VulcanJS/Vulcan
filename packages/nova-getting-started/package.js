Package.describe({
  name: "nova:getting-started",
  summary: "Getting started posts",
  version: '0.25.7',
  git: "https://github.com/TelescopeJS/telescope-getting-started.git"
});

Npm.depends({
  // NPM package dependencies
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:core@0.25.7',
    'nova:posts@0.25.7',
    'nova:comments@0.25.7',
    'nova:users@0.25.7'
  ]);

  api.addFiles([
    // 'package-tap.i18n'
  ], ['client', 'server']);

  // both

  api.addFiles([
    'lib/getting_started.js'
  ], ['client', 'server']);

  // client

  api.addAssets([
    'content/images/stackoverflow.png',
    'content/images/telescope.png'
  ], ['client']);

  // server

  api.addFiles([
    'lib/server/dummy_content.js'
  ], ['server']);

  api.addAssets('content/read_this_first.md', 'server');
  api.addAssets('content/deploying_telescope.md', 'server');
  api.addAssets('content/customizing_telescope.md', 'server');
  api.addAssets('content/getting_help.md', 'server', 'server');
  api.addAssets('content/removing_getting_started_posts.md', 'server');

  // i18n languages (must come last)

  // var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  // var languagesPaths = languages.map(function (language) {
  //   return "i18n/"+language+".i18n.json";
  // });
  // api.addFiles(languagesPaths, ["client", "server"]);

});
