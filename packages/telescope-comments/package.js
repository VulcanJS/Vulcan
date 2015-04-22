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
    'templating',
    'aldeed:simple-schema@1.3.2',
    'iron:router@1.0.5',
    'telescope:lib@0.3.0',
    'telescope:users@0.1.0',
    'matb33:collection-hooks@0.7.11'
  ]);

  api.add_files([
    'lib/comments.js',
  ], ['client', 'server']);

  api.add_files([
    'lib/client/templates/comment_edit.html',
    'lib/client/templates/comment_edit.js',
    'lib/client/templates/comment_form.html',
    'lib/client/templates/comment_form.js',
    'lib/client/templates/comment_item.html',
    'lib/client/templates/comment_item.js',
    'lib/client/templates/comment_list.html',
    'lib/client/templates/comment_list.js',
    'lib/client/templates/comment_reply.html',
    'lib/client/templates/comment_reply.js'
  ], ['client']);

  api.add_files([
    'lib/server/publications.js',
  ], ['server']);

  api.export('Comments');

});
