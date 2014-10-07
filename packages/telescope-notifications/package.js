Package.describe({
  summary: "Telescope notifications package",
  version: '0.1.0',
  name: "telescope-notifications"
});

Package.onUse(function (api) {

  api.use([
    'telescope-lib',
    'telescope-base',
    'telescope-email',
    'kestanous:herald@0.6.0',
    'kestanous:herald-email@0.2.1'
  ], ['client', 'server']);

  api.use([
    'iron:router',
    'jquery',
    'underscore',
    'templating',
    'tracker'
  ], 'client');

  api.use([
    'cmather:handlebars-server'
  ], ['server']);

  api.add_files([
    'lib/notifications.js',
    'lib/herald.js'
  ], ['client', 'server']);

  api.add_files([
    'lib/client/templates/notification_item.html',
    'lib/client/templates/notification_item.js',
    'lib/client/templates/notification_new_comment.html',
    'lib/client/templates/notification_new_reply.html',
    'lib/client/templates/notifications_menu.html',
    'lib/client/templates/notifications_menu.js',
    'lib/client/templates/unsubscribe.html',
    'lib/client/templates/unsubscribe.js',
  ], ['client']);

  api.add_files([
    'lib/server/notifications-server.js'
  ], ['server']);
  
  api.export([
    'Herald',
    'buildEmailNotification',
    'getUnsubscribeLink'
  ]);
});

// TODO: once user profile edit form is generated dynamically, add notification options from this package as well.
