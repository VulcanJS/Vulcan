Package.describe({
  name: "telescope:releases",
  summary: "Show Telescope release notes and phone home with some stats.",
  version: "0.1.0",
  git: "https://github.com/TelescopeJS/telescope-releases.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  // --------------------------- 1. Meteor packages dependencies ---------------------------

  // automatic (let the package specify where it's needed)

  api.use([
    'tap:i18n@1.4.1',                   // internationalization package
    'iron:router@1.0.5',                // routing package
    'telescope:lib@0.3.0',              // useful functions
    'telescope:i18n@0.1.0',             // internationalization wrapper
    'fourseven:scss@2.1.1'              // SCSS compilation package
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
  api.addFiles('releases/0.14.1.md', 'server', { isAsset: true });
  api.addFiles('releases/0.14.2.md', 'server', { isAsset: true });
  api.addFiles('releases/0.14.3.md', 'server', { isAsset: true });
  api.addFiles('releases/0.15.0.md', 'server', { isAsset: true });
  api.addFiles('releases/0.15.1.md', 'server', { isAsset: true });

  // i18n languages (must come last)

  api.add_files([
    'i18n/en.i18n.json'
  ], ['client', 'server']);

  // -------------------------------- 3. Variables to export --------------------------------

  api.export([
    'Releases'
  ]);

});
