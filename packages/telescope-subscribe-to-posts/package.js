Package.describe({
  summary: 'Subscribe to posts to be notified when they get new comments',
  version: '0.1.0',
  name: 'telescope-subscribe-to-posts'
});


Package.onUse(function (api) {

  // --------------------------- 1. Meteor packages dependencies ---------------------------

  // automatic (let the package specify where it's needed)

  api.use([
    'tap:i18n',
    'iron:router',
    'telescope-base',
    'telescope-lib',
    'telescope-i18n',
    'fourseven:scss',
    'telescope-notifications'
  ]);

  // client

  api.use([
    'jquery',                     // useful for DOM interactions
    'underscore',                 // JavaScript swiss army knife library
    'templating',                 // required for client-side templates
    'telescope-messages'
  ], ['client']);

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
