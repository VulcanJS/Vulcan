Package.describe({
  name: 'telescope:users',
  summary: 'Telescope permissions.',
  version: '0.1.0'
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:users-base@0.0.1',
    'telescope:lib@0.3.1',
    'telescope:settings@0.1.0',
    'telescope:i18n@0.1.0'
  ]);

  api.addFiles([
    'package-tap.i18n',
    'lib/roles.js',
    'lib/permissions.js',
    'lib/avatars.js',
    'lib/callbacks.js',
    'lib/modules.js',
    'lib/menu.js',
    'lib/methods.js',
    'lib/routes.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/templates/account/user_account.html',
    'lib/client/templates/account/user_account.js',
    'lib/client/templates/dashboard/users-dashboard.html',
    'lib/client/templates/dashboard/users-dashboard.js',
    'lib/client/templates/dashboard/users_list_actions.html',
    'lib/client/templates/dashboard/users_list_actions.js',
    'lib/client/templates/dashboard/users_list_avatar.html',
    'lib/client/templates/dashboard/users_list_created_at.html',
    'lib/client/templates/dashboard/users_list_email.html',
    'lib/client/templates/dashboard/users_list_username.html',
    'lib/client/templates/profile/user_comments.html',
    'lib/client/templates/profile/user_comments.js',
    'lib/client/templates/profile/user_downvoted_posts.html',
    'lib/client/templates/profile/user_downvoted_posts.js',
    'lib/client/templates/profile/user_info.html',
    'lib/client/templates/profile/user_info.js',
    'lib/client/templates/profile/user_posts.html',
    'lib/client/templates/profile/user_posts.js',
    'lib/client/templates/profile/user_upvoted_posts.html',
    'lib/client/templates/profile/user_upvoted_posts.js',
    'lib/client/templates/sign_out.html',
    'lib/client/templates/user_edit.html',
    'lib/client/templates/user_complete.html',
    'lib/client/templates/user_complete.js',
    'lib/client/templates/user_item.html',
    'lib/client/templates/user_item.js',
    'lib/client/templates/user_profile.html'
  ], ['client']);

  api.addFiles([
    'lib/server/publications.js',
    'lib/server/create_user.js'
  ], ['server']);

  api.addFiles([
    "i18n/en.i18n.json",
    "i18n/fr.i18n.json"
  ], ["client", "server"]);

  api.export('Users');

});
