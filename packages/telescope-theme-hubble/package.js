Package.describe({summary: "Telescope Hubble theme"});

Package.onUse(function (api) {

  api.use(
    [
      'telescope-lib',
      'telescope-base',
      'fourseven:scss'
    ],
    ['client', 'server']
  );

  api.addFiles([
    'lib/hubble.js',
    ], ['client', 'server']);

  api.addFiles(
    [
      // modules
      'lib/client/scss/modules/_accounts.scss',
      'lib/client/scss/modules/_banners.scss',
      'lib/client/scss/modules/_comments.scss',
      'lib/client/scss/modules/_dialogs.scss',
      'lib/client/scss/modules/_errors.scss',
      'lib/client/scss/modules/_layout.scss',
      'lib/client/scss/modules/_nav.scss',
      'lib/client/scss/modules/_posts.scss',
      'lib/client/scss/modules/_user-profile.scss',

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