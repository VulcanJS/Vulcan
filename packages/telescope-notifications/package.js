Package.describe({
  name: "telescope:notifications",
  summary: "Telescope notifications package",
  version: "0.20.4",
  git: "https://github.com/TelescopeJS/telescope-notifications.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'telescope:core@0.20.4',
    'kestanous:herald@1.3.0',
    'kestanous:herald-email@0.5.0',
    'cmather:handlebars-server@0.2.0'
  ]);

  api.addFiles([
    'lib/notifications.js',
    'lib/herald.js',
    'lib/modules.js',
    'package-tap.i18n'
  ], ['client', 'server']);

  api.addFiles([
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

  api.addFiles([
    'lib/server/notifications-server.js',
    'lib/server/routes.js'
  ], ['server']);

  api.addFiles([
    "i18n/de.i18n.json",
    "i18n/en.i18n.json",
    "i18n/es.i18n.json",
    "i18n/fr.i18n.json",
    "i18n/it.i18n.json",
    "i18n/zh-CN.i18n.json",
  ], ["client", "server"]);

  api.export([
    'Herald'
  ]);
});

// TODO: once user profile edit form is generated dynamically, add notification options from this package as well.
