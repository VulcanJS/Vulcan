Package.describe({
  summary: 'Telescope custom package',
  version: '1.0.0',
  name: 'telescope-custom'
});

  Package.onUse(function (api) {


  api.use([
    'tap:i18n',                   // internationalization package
    'iron:router',                // routing package
    'telescope-base',             // basic Telescope hooks and objects
    'telescope-lib',              // useful functions
    'telescope-i18n',             // internationalization wrapper
    'fourseven:scss'              // SCSS compilation package
  ]);

  // client

  api.use([
    'jquery',                     // useful for DOM interactions
    'underscore',                 // JavaScript swiss army knife library
    'templating'                  // required for client-side templates
  ], ['client']);

  // server

  api.use([
    //
  ], ['server']);

  api.addFiles([
    'lib/hubble.js',
    'postFields.js',
    ], ['client', 'server']);

  api.addFiles(
    [
      // modules
      'lib/client/scss/modules/_accounts.scss',
      'lib/client/scss/modules/_banners.scss',
      'lib/client/scss/modules/_comments.scss',
      'lib/client/scss/modules/_dialogs.scss',
      'lib/client/scss/modules/_errors.scss',
      'lib/client/scss/modules/_icons.scss',
      'lib/client/scss/modules/_nav.scss',
      'lib/client/scss/modules/_posts.scss',
      'lib/client/scss/modules/_user-profile.scss',

      // partials
      'lib/client/scss/partials/_colors.scss',
      'lib/client/scss/partials/_grid.scss',
      'lib/client/scss/partials/_icons.scss',
      'lib/client/scss/partials/_mixins.scss',
      'lib/client/scss/partials/_tooltips.scss',
      'lib/client/scss/partials/_typography.scss',

      // screen
      'lib/client/scss/screen.scss',
      'category.scss',
       'thumbnail.scss',

      'custom.css',
      'Preis.html',
      'banner.html',
      'banner.js',
      'postRankPoints.js',
      'postRankPoints.html',
      'postsDailydeutsch.js',
      'postsDailydeutsch.html',
      'postSharedaily.js',
      'postSharedaily.js',
      'postupvotesemantic.js',
      'postupvotesemantic.html',
      'daily_post_submit.html',
      'daily_post_submit_form.html',
      'daily_post_submit_form.js',
      'postPage.js',
      'postPage.html',
      'userPostsDeutsch.js',
      'userPostsDeutsch.html',
      'postDomainGesehenbei.js',
      'postDomainGesehenbei.html',
      'postSharedaily.html'

    ],
    'client'
  );

});