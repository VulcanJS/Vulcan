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
    'cmather:handlebars-server'
  ], ['server']);

  api.add_files([
    'lib/server/email.js',
    'lib/server/templates/emailAccountApproved.handlebars',
    'lib/server/templates/emailInvite.handlebars',
    'lib/server/templates/emailNewComment.handlebars',
    'lib/server/templates/emailNewPost.handlebars',
    'lib/server/templates/emailNewReply.handlebars',
    'lib/server/templates/emailNewUser.handlebars',
    'lib/server/templates/emailTest.handlebars',
    'lib/server/templates/emailWrapper.handlebars',
  ], ['server']);
  
  api.export([
    'buildEmailTemplate', 
    'sendEmail',
    'buildAndSendEmail',
    'getEmailTemplate'
  ]);
});