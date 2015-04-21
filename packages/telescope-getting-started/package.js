Package.describe({
  name: "telescope:getting-started",
  summary: "Getting started posts",
  version: '0.1.0',
  git: "https://github.com/TelescopeJS/telescope-getting-started.git"
});

Npm.depends({
  // NPM package dependencies
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
    'telescope:posts@0.1.2',
    'momentjs:moment@2.10.0'
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
    'lib/getting_started.js'
  ], ['client', 'server']);

  // client

  api.add_files([
    'content/images/stackoverflow.png',
    'content/images/telescope.png'
  ], ['client']);

  // server

  api.add_files([
    'lib/server/dummy_content.js'
  ], ['server']);

  api.addFiles('content/read_this_first.md', 'server', { isAsset: true });
  api.addFiles('content/deploying_telescope.md', 'server', { isAsset: true });
  api.addFiles('content/customizing_telescope.md', 'server', { isAsset: true });
  api.addFiles('content/getting_help.md', 'server', { isAsset: true });
  api.addFiles('content/removing_getting_started_posts.md', 'server', { isAsset: true });

  // i18n languages (must come last)

  api.add_files([
    'i18n/en.i18n.json',
  ], ['client', 'server']);

  // -------------------------------- 3. Variables to export --------------------------------

  api.export([
    'deleteDummyContent'
  ]);

});
