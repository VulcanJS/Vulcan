Package.describe({
  name: "telescope:theme-hubble",
  summary: "Telescope Hubble theme package",
  version: "0.25.5",
  git: "https://github.com/TelescopeJS/telescope-theme-hubble.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['telescope:core@0.25.5']);

  api.addFiles([
    'lib/hubble.js',
    ], ['client', 'server']);

  api.addFiles(
    [
      // modules
      'lib/client/scss/modules/_accounts.scss',
      'lib/client/scss/modules/_comments.scss',
      'lib/client/scss/modules/_dialogs.scss',
      'lib/client/scss/modules/_nav.scss',
      'lib/client/scss/modules/_posts.scss',
      'lib/client/scss/modules/_user-profile.scss',
      'lib/client/scss/modules/_banners.scss',

      // partials
      'lib/client/scss/partials/_colors.scss',
      'lib/client/scss/partials/_grid.scss',
      'lib/client/scss/partials/_mixins.scss',
      'lib/client/scss/partials/_tooltips.scss',
      'lib/client/scss/partials/_typography.scss',

      // screen
      'lib/client/scss/screen.scss'
    ],
    'client'
  );

});
