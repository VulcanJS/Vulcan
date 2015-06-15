Package.describe({
  name: "telescope:comments",
  summary: "Telescope comments package",
  version: "0.20.5",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:lib@0.20.5',
    'telescope:i18n@0.20.5',
    'telescope:settings@0.20.5',
    'telescope:users@0.20.5'
  ]);

  api.addFiles([
    'lib/comments.js',
    'lib/methods.js',
    'lib/callbacks.js',
    'lib/views.js',
    'lib/parameters.js',
    'lib/routes.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/templates/comment_edit.html',
    'lib/client/templates/comment_edit.js',
    'lib/client/templates/comment_submit.html',
    'lib/client/templates/comment_submit.js',
    'lib/client/templates/comment_item.html',
    'lib/client/templates/comment_item.js',
    'lib/client/templates/comment_list.html',
    'lib/client/templates/comment_list.js',
    'lib/client/templates/comment_reply.html',
    'lib/client/templates/comment_reply.js',
    'lib/client/templates/comments_list/comments_list.html',
    'lib/client/templates/comments_list/comments_list.js',
    'lib/client/templates/comments_list/comments_list_compact.html',
    'lib/client/templates/comments_list/comments_list_compact.js',
    'lib/client/templates/comments_list/comments_list_controller.html',
    'lib/client/templates/comments_list/comments_list_controller.js',
  ], ['client']);

  api.addFiles([
    'lib/server/publications.js',
  ], ['server']);

    api.addFiles([
      "i18n/ar.i18n.json",
      "i18n/bg.i18n.json",
      "i18n/de.i18n.json",
      "i18n/el.i18n.json",
      "i18n/en.i18n.json",
      "i18n/es.i18n.json",
      "i18n/fr.i18n.json",
      "i18n/it.i18n.json"
    ], ["client", "server"]);

  api.export('Comments');

});
