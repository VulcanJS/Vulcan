Package.describe({
  name: "telescope:embedly",
  summary: "Telescope Embedly module package",
  version: "0.3.1",
  git: 'https://github.com/TelescopeJS/telescope-embedly.git'
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'telescope:lib@0.3.0',
    'telescope:posts@0.1.2',
    'telescope:settings@0.1.0',
    'aldeed:autoform@5.1.2',
    'tap:i18n@1.4.1',
    'fourseven:scss@2.1.1',
    'templating',
    'http'
  ]);

  api.use([
    'telescope:messages@0.1.0'
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
