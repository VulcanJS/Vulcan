Package.describe({summary: "Telescope base theme"});

Package.onUse(function (api) {

  api.use(['telescope-lib', 'telescope-base', 'fourseven:scss'], ['client', 'server']);

  api.addFiles(
    [
      // global
      'lib/client/scss/global/_forms.scss',
      'lib/client/scss/global/_links.scss',
      'lib/client/scss/global/_icons.scss',
      'lib/client/scss/global/_main.scss',
      'lib/client/scss/global/_markdown.scss',
      'lib/client/scss/global/_tables.scss',
      'lib/client/scss/global/_typography.scss',

      // includes
      'lib/client/scss/includes/_breakpoints.scss',
      'lib/client/scss/includes/_colors.scss',
      'lib/client/scss/includes/_mixins.scss',

      // specific
      'lib/client/scss/specific/_admin.scss',
      'lib/client/scss/specific/_avatars.scss',
      'lib/client/scss/specific/_errors.scss',
      'lib/client/scss/specific/_nav.scss',
      'lib/client/scss/specific/_layout.scss',
      'lib/client/scss/specific/_loading.scss',
      'lib/client/scss/specific/_mobile_nav.scss',
      'lib/client/scss/specific/_notifications.scss',
      'lib/client/scss/specific/_posts.scss',
      'lib/client/scss/specific/_users.scss',

      // screen
      'lib/client/scss/screen.scss'
    ],
    'client'
  );

});