Package.describe({
  name: "telescope:posts",
  summary: "Telescope posts package",
  version: "0.1.2",
  git: "https://github.com/TelescopeJS/telescope-posts.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:lib@0.3.0',
    'telescope:settings@0.1.0',
    'telescope:users@0.1.0',
    'telescope:comments@0.1.0'
  ]);

  api.add_files([
    'lib/posts.js',
    'lib/config.js',
    'lib/helpers.js',
    'lib/hooks.js',
    'lib/methods.js',
    'lib/routes.js'
  ], ['client', 'server']);

  api.add_files([
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
    'lib/client/templates/post_list_top.html',
    'lib/client/templates/post_list_top.js',
    'lib/client/templates/post_page.html',
    'lib/client/templates/post_page.js',
    'lib/client/templates/post_submit.html',
    'lib/client/templates/post_submit.js',
    'lib/client/templates/post_views_nav.html',
    'lib/client/templates/post_view_nav.js',
    'lib/client/templates/postList/posts_list.html',
    'lib/client/templates/postList/posts_list.js',
  ], ['client']);

  api.add_files([
    'lib/server/publications.js'
  ], ['server']);

  api.export('Posts');

});
