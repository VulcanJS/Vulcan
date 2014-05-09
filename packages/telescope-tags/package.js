Package.describe("Telescope tags package");

Package.on_use(function (api) {
  api.use([
    'jquery',
    'underscore',
    'iron-router',
    'templating'
  ], 'client');

  api.add_files([
    'lib/client/tags.js', 
    'lib/client/routes.js',
    'lib/client/views/categories.html',
    'lib/client/views/categories.js',
    ], ['client']);
  api.add_files(['lib/server/publications.js'], ['server']);
  // api.export('i18n');
});