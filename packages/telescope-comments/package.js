Package.describe({
  name: "telescope:comments",
  summary: "Telescope comments package",
  version: "0.1.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:lib@0.3.0',
    'telescope:settings@0.1.0',
    'telescope:users@0.1.0'
  ]);

  api.add_files([
    'lib/comments.js',
    'lib/methods.js',
    'lib/callbacks.js',
    'lib/routes.js'
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
