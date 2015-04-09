Package.describe({
  summary: "Show a banner containing your site's tagline on the homepage",
  version: '0.1.0',
  name: 'telescope-tagline-banner'
});

Package.onUse(function (api) {

  // --------------------------- 1. Meteor packages dependencies ---------------------------

  // automatic (let the package specify where it's needed)

  api.use([
    'telescope-base',             // basic Telescope hooks and objects
    'telescope-lib',              // useful functions
    'telescope-settings',
    'fourseven:scss',             // SCSS compilation package
    'tap:i18n'
  ]);

  // client

  api.use([
    'jquery',                     // useful for DOM interactions
    'underscore',                 // JavaScript swiss army knife library
    'templating'                  // required for client-side templates
  ], ['client']);


  // ---------------------------------- 2. Files to include ----------------------------------

  api.add_files([
    'lib/tagline.js',
    'package-tap.i18n'
  ], ['client', 'server']);

  // client

  api.add_files([
    'lib/client/templates/tagline_banner.html',
    'lib/client/templates/tagline_banner.js',
    'lib/client/stylesheets/tagline_banner.scss'
  ], ['client']);

  api.add_files([
    "i18n/en.i18n.json"
  ], ["client", "server"]);

});
