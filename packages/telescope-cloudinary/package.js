Package.describe({
  name: 'telescope:cloudinary',
  summary: 'Telescope file upload package.',
  version: '0.25.6',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Npm.depends({
  cloudinary: "1.2.5"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:core@0.25.6',
    // 'lepozepo:cloudinary@4.1.1'
    // 'lepozepo:s3@5.1.5'
  ]);

  api.addFiles([
    'package-tap.i18n',
    'lib/custom_fields.js'
  ], ['client', 'server']);

  api.addFiles([
    
  ], ['client']);

  api.addFiles([
    'lib/server/cloudinary.js'
  ], ['server']);

  var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);
  
  api.export('Cloudinary');

});
