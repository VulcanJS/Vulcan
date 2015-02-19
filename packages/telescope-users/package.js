Package.describe({
  name: 'telescope-users',
  version: '0.1.0',
  summary: ''
});

Package.onUse(function (api) {

  api.use([
    'tap:i18n',
    'iron:router',
    'telescope-base',
    'telescope-lib',
    'telescope-i18n',
    'aldeed:simple-schema',
    'aldeed:autoform',
    'accounts-base',
    'matb33:collection-hooks'
  ], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'templating'
  ], 'client');

  // i18n config (must come first)
  api.addFiles([
    'package-tap.i18n'
  ], ['client', 'server']);

  // both
  api.addFiles([
    'lib/routes.js',
    'lib/users.js'
  ], ['client', 'server']);

  // client
  api.addFiles([
    'lib/client/users/sign_out.html',
    'lib/client/users/user_edit.html',
    'lib/client/users/user_edit.js',
    'lib/client/users/user_email.html',
    'lib/client/users/user_email.js',
    'lib/client/users/user_item.html',
    'lib/client/users/user_item.js',
    'lib/client/users/user_profile.html',
    'lib/client/users/user_profile.js',
    'lib/client/users/users.html',
    'lib/client/users/users.js',
    'lib/client/users/account/user_account.html',
    'lib/client/users/account/user_account.js',
    'lib/client/users/profile/user_comments.html',
    'lib/client/users/profile/user_comments.js',
    'lib/client/users/profile/user_downvoted_posts.html',
    'lib/client/users/profile/user_downvoted_posts.js',
    'lib/client/users/profile/user_info.html',
    'lib/client/users/profile/user_info.js',
    'lib/client/users/profile/user_posts.html',
    'lib/client/users/profile/user_posts.js',
    'lib/client/users/profile/user_upvoted_posts.html',
    'lib/client/users/profile/user_upvoted_posts.js',
  ], ['client']);

  // server
  api.addFiles([
    'lib/server/users.js',
    'lib/server/publications/user_profile.js',
    'lib/server/publications/users.js',
    'lib/server/publications/users_dashboard.js',
  ], ['server']);

  // i18n languages (must come last)
  api.addFiles([
    'i18n/en.i18n.json',
  ], ['client', 'server']);

  api.export([
    'Accounts',
    'isAdminById',
    'isAdmin',
    'updateAdmin',
    'isInvited',
    'adminUsers',
    'adminMongoQuery',
    'notAdminMongoQuery',
    'getUserName',
    'getDisplayName',
    'getDisplayNameById',
    'getProfileUrl',
    'getProfileUrlBySlugOrId',
    'hasPassword',
    'getTwitterName',
    'getGitHubName',
    'getTwitterNameById',
    'getEmail',
    'getEmailHash',
    'getAvatarUrl',
    'getCurrentUserEmail',
    'userProfileComplete',
    'findLast',
    'timeSinceLast',
    'numberOfItemsInPast24Hours',
    'getUserSetting',
    'setUserSetting',
    'getProperty'
  ]);

});