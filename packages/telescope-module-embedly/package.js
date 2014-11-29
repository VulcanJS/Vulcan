Package.describe({
  summary: "Telescope Embedly module package",
  version: '0.2.9',
  name: "telescope-module-embedly",
  git: 'https://github.com/TelescopeJS/Telescope-Module-Embedly.git'
});

Package.onUse( function(api) {  

  api.versionsFrom("METEOR@0.9.0");

  api.use([
    'telescope-lib', 
    'telescope-base',
    'aldeed:autoform',
    'templating',
    'http'
  ]);

  api.add_files(['lib/embedly.js'], ['client', 'server']);

  api.add_files(['lib/server/get_embedly_data.js'], ['server']);

  api.add_files([
    'lib/client/autoform-postthumbnail.html', 
    'lib/client/autoform-postthumbnail.js', 
    'lib/client/post_thumbnail.html', 
    'lib/client/post_thumbnail.js', 
    'lib/client/post_thumbnail.css',
    'lib/client/post_video.html',
    'lib/client/post_video.js'
  ], ['client']);
});