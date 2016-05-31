Package.describe({
  name: 'nova:cloudinary',
  summary: 'Telescope file upload package.',
  version: '0.26.2-nova',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:posts@0.26.2-nova',
    'nova:core@0.26.2-nova'
  ]);

  api.use([
    'nova:settings@0.26.1-nova'
  ], {weak: true});

  api.addFiles([
    // 'package-tap.i18n',
    'lib/custom_fields.js'
  ], ['client', 'server']);

  api.addFiles([
    
  ], ['client']);

  api.addFiles([
    'lib/server/cloudinary.js'
  ], ['server']);

  // var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  // var languagesPaths = languages.map(function (language) {
  //   return "i18n/"+language+".i18n.json";
  // });
  // api.addFiles(languagesPaths, ["client", "server"]);
  
  api.export('Cloudinary');

});
