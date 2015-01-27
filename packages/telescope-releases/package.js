Package.describe({
  summary: 'Show Telescope release notes.',
  version: '0.1.0',
  name: 'telescope-releases'
});

Npm.depends({
  // NPM package dependencies
});

Package.onUse(function (api) {

  // --------------------------- 1. Meteor packages dependencies ---------------------------

  // automatic (let the package specify where it's needed)

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

  // ---------------------------------- 2. Files to include ----------------------------------

  // i18n config (must come first)

  api.add_files([
    'package-tap.i18n'
  ], ['client', 'server']);

  // both

  api.add_files([
    'lib/releases.js',
  ], ['client', 'server']);

  // client

  api.add_files([
    'lib/client/templates/current_release.html',
    'lib/client/templates/current_release.js',
    'lib/client/scss/releases.scss'
  ], ['client']);

  // server

  api.add_files([
    'lib/server/publications.js',
    'lib/server/import_releases.js'
  ], ['server']);    

  api.addFiles('releases/0.11.0.md', 'server', { isAsset: true });
  api.addFiles('releases/0.11.1.md', 'server', { isAsset: true });
  api.addFiles('releases/0.12.0.md', 'server', { isAsset: true });
  api.addFiles('releases/0.13.0.md', 'server', { isAsset: true });
  api.addFiles('releases/0.14.0.md', 'server', { isAsset: true });

  // i18n languages (must come last)

  api.add_files([
    'i18n/en.i18n.json'
  ], ['client', 'server']);

  // -------------------------------- 3. Variables to export --------------------------------

  api.export([
    'Releases'
  ]);

});