Package.describe({
  name: "telescope:posts",
  summary: "Telescope posts package",
  version: "0.25.5",
  git: "https://github.com/TelescopeJS/telescope-posts.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:lib@0.25.5',
    'telescope:i18n@0.25.5',
    'telescope:settings@0.25.5',
    'telescope:users@0.25.5',
    'telescope:comments@0.25.5'
  ]);

  api.addFiles([
    'lib/namespace.js',
    'lib/config.js',
    'lib/posts.js',
    'lib/parameters.js',
    'lib/views.js',
    'lib/helpers.js',
    'lib/modules.js',
    'lib/callbacks.js',
    'lib/methods.js',
    'lib/transitions.js',
    'lib/menus.js',
    'lib/routes.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/templates/after_post_item.html',
    'lib/client/templates/before_post_item.html',
    'lib/client/templates/modules/post_actions.html',
    'lib/client/templates/modules/post_actions.js',
    'lib/client/templates/modules/post_admin.html',
    'lib/client/templates/modules/post_admin.js',
    'lib/client/templates/modules/post_author.html',
    'lib/client/templates/modules/post_author.js',
    'lib/client/templates/modules/post_avatars.html',
    'lib/client/templates/modules/post_avatars.js',
    'lib/client/templates/modules/post_comments_link.html',
    'lib/client/templates/modules/post_content.html',
    'lib/client/templates/modules/post_content.js',
    'lib/client/templates/modules/post_discuss.html',
    'lib/client/templates/modules/post_domain.html',
    'lib/client/templates/modules/post_domain.js',
    'lib/client/templates/modules/post_info.html',
    'lib/client/templates/modules/post_info.js',
    'lib/client/templates/modules/post_rank.html',
    'lib/client/templates/modules/post_rank.js',
    'lib/client/templates/modules/post_title.html',
    'lib/client/templates/modules/post_vote.html',
    'lib/client/templates/modules/post_vote.js',
    'lib/client/templates/post_body.html',
    'lib/client/templates/post_edit.html',
    'lib/client/templates/post_edit.js',
    'lib/client/templates/post_item.html',
    'lib/client/templates/post_item.js',
    'lib/client/templates/post_page.html',
    'lib/client/templates/post_page.js',
    'lib/client/templates/post_submit.html',
    'lib/client/templates/post_submit.js',
    'lib/client/templates/views_menu.html',
    'lib/client/templates/views_menu.js',
    'lib/client/templates/main_posts_list.html',
    'lib/client/templates/main_posts_list.js',
    'lib/client/templates/posts_list/posts_list.html',
    'lib/client/templates/posts_list/posts_list.js',
    'lib/client/templates/posts_list/posts_list_compact.html',
    'lib/client/templates/posts_list/posts_list_compact.js',
    'lib/client/templates/posts_list/posts_list_controller.html',
    'lib/client/templates/posts_list/posts_list_controller.js'
  ], ['client']);

  api.addFiles([
    'lib/server/publications.js',
    'lib/server/fastrender.js'
  ], ['server']);

  var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);

  api.export('Posts');

});
