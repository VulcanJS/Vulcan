Package.describe({
  name: "telescope:releases",
  summary: "Show Telescope release notes and phone home with some stats.",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/telescope-releases.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  // --------------------------- 1. Meteor packages dependencies ---------------------------

  api.use(['telescope:core@0.21.1']);

  // ---------------------------------- 2. Files to include ----------------------------------

  // i18n config (must come first)

  api.addFiles([
    'package-tap.i18n'
  ], ['client', 'server']);

  // both

  api.addFiles([
    'lib/releases.js',
  ], ['client', 'server']);

  // client

  api.addFiles([
    'lib/client/templates/current_release.html',
    'lib/client/templates/current_release.js',
    'lib/client/scss/releases.scss'
  ], ['client']);

  // server

  api.addFiles([
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
  api.addFiles('releases/0.20.4.md', 'server', { isAsset: true });
  api.addFiles('releases/0.20.5.md', 'server', { isAsset: true });
  api.addFiles('releases/0.20.6.md', 'server', { isAsset: true });
  api.addFiles('releases/0.21.1.md', 'server', { isAsset: true });

  // i18n languages (must come last)

  api.addFiles([
    'i18n/en.i18n.json'
  ], ['client', 'server']);

  // -------------------------------- 3. Variables to export --------------------------------

  api.export([
    'Releases'
  ]);

});
