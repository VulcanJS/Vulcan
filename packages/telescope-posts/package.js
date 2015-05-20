Package.describe({
  name: "telescope:posts",
  summary: "Telescope posts package",
  version: "0.20.4",
  git: "https://github.com/TelescopeJS/telescope-posts.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:lib@0.20.4',
    'telescope:i18n@0.20.4',
    'telescope:settings@0.20.4',
    'telescope:users@0.20.4',
    'telescope:comments@0.20.4'
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
    'lib/client/templates/modules/post_upvote.html',
    'lib/client/templates/modules/post_upvote.js',
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

  api.export('Posts');

});
