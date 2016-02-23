Package.describe({
  name: "nova:base-components",
  summary: "Telescope components package",
  version: "0.25.7",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:core@0.25.7',
    'telescope:posts@0.25.7',
    // 'telescope:i18n@0.25.7',
    // 'telescope:settings@0.25.7',
    'telescope:users@0.25.7',
    'telescope:comments@0.25.7',

    'alt:react-accounts-ui@1.0.0',
    'dburles:spacebars-tohtml@1.0.1',

    // 'alt:react-accounts-unstyled'
    
  ]);

  api.addFiles([
    'lib/config.js',
    'lib/components.js',
    'lib/routes.jsx'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/accounts.js'
  ], ['client']);

  api.addFiles([
    'lib/server/routes.js',
    'lib/server/templates.js'
  ], ['server']);

  api.addAssets([
    'lib/server/emails/common/test.handlebars',
    'lib/server/emails/common/wrapper.handlebars',
    'lib/server/emails/comments/newComment.handlebars',
    'lib/server/emails/comments/newReply.handlebars',
    'lib/server/emails/posts/newPendingPost.handlebars',
    'lib/server/emails/posts/newPost.handlebars',
    'lib/server/emails/posts/postApproved.handlebars',
    'lib/server/emails/users/accountApproved.handlebars',
    'lib/server/emails/users/newUser.handlebars',
  ], ['server']);

});
