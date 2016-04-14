Package.describe({
  name: "nova:embedly",
  summary: "Telescope Embedly module package",
  version: "0.26.0-nova",
  git: 'https://github.com/TelescopeJS/telescope-embedly.git'
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.26.0-nova',
    'nova:posts@0.26.0-nova',
    'nova:users@0.26.0-nova'
  ]);

  api.addFiles([
    // 'package-tap.i18n',
    'lib/embedly.js',
    'lib/custom_fields.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/get_embedly_data.js'
  ], ['server']);

  api.addFiles([
    // 'lib/client/js/jquery.fitvids.js',
    // 'lib/client/autoform-postthumbnail.html',
    // 'lib/client/autoform-postthumbnail.js',
    // 'lib/client/post_thumbnail.html',
    // 'lib/client/post_thumbnail.js',
    // 'lib/client/post_thumbnail.scss'
  ], ['client']);

  // var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  // var languagesPaths = languages.map(function (language) {
  //   return "i18n/"+language+".i18n.json";
  // });
  // api.addFiles(languagesPaths, ["client", "server"]);
  
});
