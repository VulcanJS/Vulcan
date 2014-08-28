Package.describe({summary: "Telescope share module package"});

Package.onUse(function (api) {

  api.use(['telescope-lib', 'telescope-base'], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'templating'
  ], 'client');

  api.add_files(['lib/share.js'], ['client', 'server']);

  api.add_files(['lib/client/post_share.html', 'lib/client/post_share.js'], ['client']);
  
  // api.export();
});