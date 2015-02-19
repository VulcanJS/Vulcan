Package.describe({
  name: 'alastaar:photos',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'package to add photo ability to Telescope',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.addFiles('alastaar:photos.js');
  api.use([
    'tap:i18n',                   // internationalization package
    'iron:router',                // routing package
    'telescope-base',             // basic Telescope hooks and objects
    'telescope-lib',              // useful functions
    'telescope-i18n',             // internationalization wrapper
    'fourseven:scss'              // SCSS compilation package
  ]);

  api.use([
    'jquery',                     // useful for DOM interactions
    'underscore',                 // JavaScript swiss army knife library
    'templating'                  // required for client-side templates
  ], ['client']);

  api.use([
  ], ['server']);

    // i18n config (must come first)

  api.add_files([
    'package-tap.i18n'
  ], ['client', 'server']);

  // both

  api.add_files([
    'lib/custom_fields.js',
    'lib/hooks.js',
    'lib/main.js',
    'lib/routes.js',
    'lib/settings.js',
    'lib/templates.js'
  ], ['client', 'server']);

  // client

  api.add_files([
    'lib/client/templates/photo_template.html',
    'lib/client/templates/photo_template.js',
    'lib/client/templates/customPostTitle.html',
    'lib/client/stylesheets/custom.scss'
  ], ['client']);

  // server

  api.add_files([
    'lib/server/publications.js'
  ], ['server']);    

  // i18n languages (must come last)

  api.add_files([
    'i18n/en.i18n.json',
  ], ['client', 'server']);

  // -------------------------------- 3. Variables to export --------------------------------

  api.export([
    'myFunction'
  ]);

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('alastaar:photos');
  api.addFiles('alastaar:photos-tests.js');
});
