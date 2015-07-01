Package.describe({
  name: "telescope:getting-started",
  summary: "Getting started posts",
  version: '0.21.1',
  git: "https://github.com/TelescopeJS/telescope-getting-started.git"
});

Npm.depends({
  // NPM package dependencies
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  // --------------------------- 1. Meteor packages dependencies ---------------------------

  // automatic (let the package specify where it's needed)

  api.use(['telescope:core@0.21.1']);

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

  api.addFiles([
    'package-tap.i18n'
  ], ['client', 'server']);

  // both

  api.addFiles([
    'lib/getting_started.js'
  ], ['client', 'server']);

  // client

  api.addFiles([
    'content/images/stackoverflow.png',
    'content/images/telescope.png'
  ], ['client']);

  // server

  api.addFiles([
    'lib/server/dummy_content.js'
  ], ['server']);

  api.addFiles('content/read_this_first.md', 'server', { isAsset: true });
  api.addFiles('content/deploying_telescope.md', 'server', { isAsset: true });
  api.addFiles('content/customizing_telescope.md', 'server', { isAsset: true });
  api.addFiles('content/getting_help.md', 'server', { isAsset: true });
  api.addFiles('content/removing_getting_started_posts.md', 'server', { isAsset: true });

  // i18n languages (must come last)

  api.addFiles([
    'i18n/en.i18n.json',
  ], ['client', 'server']);

});
