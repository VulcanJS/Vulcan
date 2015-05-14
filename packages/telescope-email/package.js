Package.describe({
  name: "telescope:email",
  summary: "Telescope email package",
  version: "0.3.0",
  git: "https://github.com/TelescopeJS/telescope-email.git"
});

Npm.depends({
  "html-to-text": "0.1.0"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:core@0.1.0',
    'sacha:juice@0.1.4',
    'cmather:handlebars-server@0.2.0'
  ]);

  // do not use for now since tap:i18n doesn't support server-side templates yet
  // api.addFiles([
  //   'package-tap.i18n'
  // ], ['client', 'server']);

  api.addFiles([
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

  api.addFiles([
    "i18n/de.i18n.json",
    "i18n/en.i18n.json",
    "i18n/es.i18n.json",
    "i18n/fr.i18n.json",
    "i18n/it.i18n.json",
    "i18n/zh-CN.i18n.json",
  ], ["client", "server"]);

});
