Package.describe({
  name: "telescope:subscribe-to-posts",
  summary: "Subscribe to posts to be notified when they get new comments",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/telescope-subscribe-to-posts.git"
});


Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  // --------------------------- 1. Meteor packages dependencies ---------------------------

  // automatic (let the package specify where it's needed)

  api.use(['telescope:core@0.21.1']);

  // ---------------------------------- 2. Files to include ----------------------------------

  // i18n config (must come first)

  api.addFiles([
    'package-tap.i18n'
  ], ['client', 'server']);

  // both

  api.addFiles([
    'lib/subscribe-to-posts.js',
  ], ['client', 'server']);

  // client

  api.addFiles([
    'lib/client/templates/post_subscribe.html',
    'lib/client/templates/post_subscribe.js',
    'lib/client/templates/user_subscribed_posts.html',
    'lib/client/templates/user_subscribed_posts.js',
    'lib/client/stylesheets/subscribe-to-posts.scss'
  ], ['client']);

  // server

  api.addFiles([
    'lib/server/publications.js'
  ], ['server']);

  // i18n languages (must come last)

  api.addFiles([
    'i18n/en.i18n.json',
  ], ['client', 'server']);

  api.export([
    'subscribeItem',
    'unsubscribeItem'
  ]);

});
