Package.describe({
  name: "telescope:embedly",
  summary: "Telescope Embedly module package",
  version: "0.22.2",
  git: 'https://github.com/TelescopeJS/telescope-embedly.git'
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['telescope:core@0.22.2']);

  api.addFiles([
    'package-tap.i18n',
    'lib/embedly.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/get_embedly_data.js'
  ], ['server']);

  api.addFiles([
    'lib/client/js/jquery.fitvids.js',
    'lib/client/autoform-postthumbnail.html',
    'lib/client/autoform-postthumbnail.js',
    'lib/client/post_thumbnail.html',
    'lib/client/post_thumbnail.js',
    'lib/client/post_thumbnail.scss'
  ], ['client']);

  api.addFiles([
    "i18n/en.i18n.json",
    "i18n/fr.i18n.json"
  ], ["client", "server"]);
});
