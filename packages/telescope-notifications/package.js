Package.describe({
  summary: "Telescope notifications package",
  version: '0.1.0',
  name: "telescope-notifications"
});

Package.onUse(function (api) {

  api.use([
    'telescope-lib',
    'telescope-base',
    'telescope-settings',
    'telescope-email',
    'iron:router',
    'kestanous:herald@1.3.0',
    'kestanous:herald-email',
    'tap:i18n'
  ], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'templating',
    'tracker'
  ], ['client']);

  api.use([
    'cmather:handlebars-server'
  ], ['server']);

  api.add_files([
    'lib/notifications.js',
    'lib/herald.js',
    'package-tap.i18n'
  ], ['client', 'server']);

  api.add_files([
    'lib/client/templates/notification_item.html',
    'lib/client/templates/notification_item.js',
    'lib/client/templates/notifications_mark_as_read.html',
    'lib/client/templates/notifications_mark_as_read.js',
    'lib/client/templates/notification_new_comment.html',
    'lib/client/templates/notification_new_reply.html',
    'lib/client/templates/notification_post_approved.html',
    'lib/client/templates/notifications_menu.html',
    'lib/client/templates/notifications_menu.js',
    'lib/client/templates/unsubscribe.html',
    'lib/client/templates/unsubscribe.js',
  ], ['client']);

  api.add_files([
    'lib/server/notifications-server.js',
    'lib/server/routes.js'
  ], ['server']);

  api.add_files([
    "i18n/de.i18n.json",
    "i18n/en.i18n.json",
    "i18n/es.i18n.json",
    "i18n/fr.i18n.json",
    "i18n/it.i18n.json",
    "i18n/zh-CN.i18n.json",
  ], ["client", "server"]);

  api.export([
    'Herald',
    'buildEmailNotification',
    'getUnsubscribeLink'
  ]);
});

// TODO: once user profile edit form is generated dynamically, add notification options from this package as well.
