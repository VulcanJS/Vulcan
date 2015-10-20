Package.describe({
  name: "telescope:prerender",
  summary: "Telescope Prereder.io package",
  version: "0.25.3",
  git: "https://github.com/TelescopeJS/Telescope"
});

Npm.depends({
  'prerender-node': '2.0.1'
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:core@0.25.3'
  ]);

  api.addFiles([
    'package-tap.i18n',
    'lib/prerender-setting.js'
  ], ['client','server']);

  api.addFiles([
    'lib/server/prerender.js'
  ], ['server']);

  var languages = ["en"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);

});
