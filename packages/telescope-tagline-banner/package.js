Package.describe({
  name: "telescope:tagline-banner",
  summary: "Show a banner containing your site's tagline on the homepage",
  version: "0.1.0",
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  // --------------------------- 1. Meteor packages dependencies ---------------------------

  // automatic (let the package specify where it's needed)

  api.use([
    'telescope:lib@0.3.0',              // useful functions
    'telescope:settings@0.1.0',
    'fourseven:scss@2.1.1',             // SCSS compilation package
    'tap:i18n@1.4.1'
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
