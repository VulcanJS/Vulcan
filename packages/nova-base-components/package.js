Package.describe({
  name: "nova:base-components",
  summary: "Telescope components package",
  version: "0.25.7",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    // Nova packages

    'nova:core@0.25.7',
    'nova:posts@0.25.7',
    'nova:users@0.25.7',
    'nova:comments@0.25.7',
    'nova:share@0.25.7',

    // third-party packages

    'tmeasday:check-npm-versions@0.1.1',
    // 'alt:react-accounts-ui@1.2.1',
    // 'alt:react-accounts-unstyled@1.2.1',
    // 'studiointeract:react-accounts-ui-basic@1.0.1',
    'studiointeract:react-accounts-ui@1.0.7',
    'dburles:spacebars-tohtml@1.0.1',
    'utilities:react-list-container'
  ]);

  api.addFiles([
    'lib/config.js',
    'lib/components.js',
    'lib/routes.jsx'
  ], ['client', 'server']);

  api.addFiles([
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
    'lib/server/emails/newsletter/newsletter.handlebars',
    'lib/server/emails/newsletter/newsletterConfirmation.handlebars',
    'lib/server/emails/newsletter/postItem.handlebars',
  ], ['server']);

});
