Package.describe({
  summary: "Telescope email package",
  version: '0.2.9',
  name: "telescope-email"
});

Npm.depends({
  "html-to-text": "0.1.0"
});

Package.onUse(function (api) {

  api.use([
    'iron:router',
    'telescope-base',
    'telescope-settings',
    'telescope-lib',
    'telescope-i18n',
    'tap:i18n'
  ], ['client', 'server']);

  api.use([
    'cmather:handlebars-server'
  ], ['server']);

  // do not use for now since tap:i18n doesn't support server-side templates yet
  // api.add_files([
  //   'package-tap.i18n'
  // ], ['client', 'server']);

  api.add_files([
    'lib/server/email.js',
    'lib/server/routes.js',
    'lib/server/templates/emailAccountApproved.handlebars',
    'lib/server/templates/emailInvite.handlebars',
    'lib/server/templates/emailNewComment.handlebars',
    'lib/server/templates/emailNewPost.handlebars',
    'lib/server/templates/emailNewPendingPost.handlebars',
    'lib/server/templates/emailPostApproved.handlebars',
    'lib/server/templates/emailNewReply.handlebars',
    'lib/server/templates/emailNewUser.handlebars',
    'lib/server/templates/emailTest.handlebars',
    'lib/server/templates/emailWrapper.handlebars',
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
    'buildEmailTemplate',
    'sendEmail',
    'buildAndSendEmail',
    'getEmailTemplate'
  ]);
});
