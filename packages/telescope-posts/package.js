Package.describe({
  name: "telescope:posts",
  summary: "Telescope posts package",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/telescope-posts.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:lib@0.21.1',
    'telescope:i18n@0.21.1',
    'telescope:settings@0.21.1',
    'telescope:users@0.21.1',
    'telescope:comments@0.21.1'
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
    'lib/client/templates/modules/post_title.js',
    'lib/client/templates/modules/post_vote.html',
    'lib/client/templates/modules/post_vote.js',
    'lib/client/templates/post_body.html',
    'lib/client/templates/post_edit.html',
    'lib/client/templates/post_edit.js',
    'lib/client/templates/post_item.html',
    'lib/client/templates/post_item.js',
    'lib/client/templates/posts_list_top.html',
    'lib/client/templates/post_page.html',
    'lib/client/templates/post_page.js',
    'lib/client/templates/post_submit.html',
    'lib/client/templates/post_submit.js',
    'lib/client/templates/posts_views_nav.html',
    'lib/client/templates/posts_view_nav.js',
    'lib/client/templates/posts_list/posts_list.html',
    'lib/client/templates/posts_list/posts_list.js',
    'lib/client/templates/posts_list/posts_list_compact.html',
    'lib/client/templates/posts_list/posts_list_compact.js',
    'lib/client/templates/posts_list/posts_list_controller.html',
    'lib/client/templates/posts_list/posts_list_controller.js'
  ], ['client']);

  api.addFiles([
    'lib/server/publications.js'
  ], ['server']);

  api.addFiles([
    "i18n/ar.i18n.json",
    "i18n/bg.i18n.json",
    "i18n/de.i18n.json",
    "i18n/el.i18n.json",
    "i18n/en.i18n.json",
    "i18n/es.i18n.json",
    "i18n/fr.i18n.json",
    "i18n/it.i18n.json",
    "i18n/nl.i18n.json",
    "i18n/pl.i18n.json",
    "i18n/pt-BR.i18n.json",
    "i18n/ro.i18n.json",
    "i18n/ru.i18n.json",
    "i18n/sv.i18n.json",
    "i18n/tr.i18n.json",
    "i18n/vi.i18n.json",
    "i18n/zh-CN.i18n.json"
  ], ["client", "server"]);

  api.export('Posts');

});
