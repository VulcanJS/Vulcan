Package.describe({
  name: "telescope:email",
  summary: "Telescope email package",
  version: "0.25.5",
  git: "https://github.com/TelescopeJS/telescope-email.git"
});

Npm.depends({
  "html-to-text": "0.1.0"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:core@0.25.5',
    'sacha:juice@0.1.4'
  ]);

  // do not use for now since tap:i18n doesn't support server-side templates yet
  // api.addFiles([
  //   'package-tap.i18n'
  // ], ['client', 'server']);

  api.addFiles([
    'lib/server/email.js',
    'lib/server/templates/emailInvite.handlebars',
    'lib/server/templates/emailTest.handlebars',
    'lib/server/templates/emailWrapper.handlebars',
  ], ['server']);

  var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);

});
