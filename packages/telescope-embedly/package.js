Package.describe({
  summary: "Telescope Embedly module package",
  version: '0.2.9',
  name: "telescope-embedly",
  git: 'https://github.com/TelescopeJS/Telescope-Module-Embedly.git'
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@0.9.0");

  api.use([
    'telescope-lib',
    'telescope-base',
    'telescope-settings',
    'aldeed:autoform',
    'tap:i18n',
    'fourseven:scss',
    'templating',
    'http'
  ]);

  api.use([
    'telescope-messages'
  ], 'client');

  api.add_files([
    'package-tap.i18n',
    'lib/embedly.js'
  ], ['client', 'server']);

  api.add_files([
    'lib/server/get_embedly_data.js'
  ], ['server']);

  api.add_files([
    'lib/client/autoform-postthumbnail.html',
    'lib/client/autoform-postthumbnail.js',
    'lib/client/post_thumbnail.html',
    'lib/client/post_thumbnail.js',
    'lib/client/post_thumbnail.scss',
    'lib/client/post_video.html',
    'lib/client/post_video.js'
  ], ['client']);

  api.add_files([
    "i18n/en.i18n.json",
    "i18n/fr.i18n.json"
  ], ["client", "server"]);
});
