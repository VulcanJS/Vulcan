Package.describe({
  name: 'telescope:users',
  summary: 'Telescope permissions.',
  version: '0.25.5',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:lib@0.25.5',
    'telescope:settings@0.25.5',
    'telescope:i18n@0.25.5'
  ]);

  api.addFiles([
    'package-tap.i18n',
    'lib/namespace.js',
    'lib/roles.js',
    'lib/config.js',
    'lib/permissions.js',
    'lib/users.js',
    'lib/avatars.js',
    'lib/callbacks.js',
    'lib/modules.js',
    'lib/helpers.js',
    'lib/menus.js',
    'lib/pubsub.js',
    'lib/methods.js',
    'lib/routes.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/templates/account/user_account.html',
    'lib/client/templates/account/user_account.js',
    'lib/client/templates/account/user_password.html',
    'lib/client/templates/account/user_password.js',
    'lib/client/templates/dashboard/users-dashboard.html',
    'lib/client/templates/dashboard/users-dashboard.js',
    'lib/client/templates/dashboard/users_list_actions.html',
    'lib/client/templates/dashboard/users_list_actions.js',
    'lib/client/templates/dashboard/users_list_avatar.html',
    'lib/client/templates/dashboard/users_list_created_at.html',
    'lib/client/templates/dashboard/users_list_email.html',
    'lib/client/templates/dashboard/users_list_username.html',
    'lib/client/templates/dashboard/users_list_display_name.html',
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
    'lib/client/templates/profile/user_profile_bio.html',
    'lib/client/templates/profile/user_profile_twitter.html',
    'lib/client/templates/sign_out.html',
    'lib/client/templates/user_edit.html',
    'lib/client/templates/user_complete.html',
    'lib/client/templates/user_complete.js',
    'lib/client/templates/user_item.html',
    'lib/client/templates/user_item.js',
    'lib/client/templates/user_profile.html',
    'lib/client/templates/user_profile.js',
    'lib/client/templates/nav/user_menu.html',
    'lib/client/templates/nav/user_menu.js',
    'lib/client/templates/nav/user_menu_label.html',
    'lib/client/templates/nav/user_menu_label.js',
    'lib/client/templates/user_controller/user_controller.html',
    'lib/client/templates/user_controller/user_controller.js'
  ], ['client']);

  api.addFiles([
    'lib/server/publications.js',
    'lib/server/create_user.js'
  ], ['server']);

  var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);
  
  api.export('Users');

});
