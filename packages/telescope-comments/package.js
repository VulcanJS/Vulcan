Package.describe({
  name: "telescope:comments",
  summary: "Telescope comments package",
  version: "0.1.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'jquery',
    'underscore',
    'mongo',
    'aldeed:simple-schema@1.3.2',
    'iron:router@1.0.5',
    'telescope:lib@0.3.0',
    'telescope:users@0.1.0'
  ]);

  api.add_files([
    'lib/comments.js',
  ], ['client', 'server']);

  api.add_files([
    'lib/server/publications.js',
  ], ['server']);

  api.export('Comments');

});
