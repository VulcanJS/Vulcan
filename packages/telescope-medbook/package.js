Package.describe({summary: "MedBook CRFs package"});

Package.onUse(function (api) {

  api.use(['telescope-lib', 'telescope-base', 'aldeed:simple-schema'], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'iron:router',
    'templating'
  ], 'client');

  api.add_files(['lib/crfs.js'], ['client', 'server']);

  api.add_files([

    'lib/client/templates/simple.html',
    'lib/client/views/simple.js',

    'lib/client/stylesheets/screen.css',
    'lib/client/stylesheets/cbioquery.css',
    'lib/client/templates/main.html',
    'lib/client/templates/cbioquery.html',
    'lib/client/medbook.js',

    'lib/client/routes.js',
    'lib/client/views/crfs.html',
    'lib/client/views/crfs.js',
    'lib/client/views/crf_item.html',
    'lib/client/views/crf_item.js',
    'lib/client/views/crfs_menu.html',
    'lib/client/views/crfs_menu.js',
    'lib/client/views/post_crfs.html',
    'lib/client/views/post_crfs.js'
    ], ['client']);

  api.add_files(['lib/server/publications.js'], ['server']);
 
  api.export(['preloadSubscriptions', 'adminNav', 'CRFs', 'addToPostSchema', 'primaryNav', 'postModules']);
});
