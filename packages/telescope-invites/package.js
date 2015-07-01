Package.describe({
  name: "telescope:invites",
  summary: "Telescope invites package",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/telescope-invites.git"
});

Npm.depends({
  // NPM package dependencies
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  // --------------------------- 1. Meteor packages dependencies ---------------------------

  // automatic (let the package specify where it's needed)

  api.use(['telescope:core@0.21.1']);

  // client

  api.use([
    'jquery',
    'underscore',
    'templating',
    'telescope:messages@0.1.0'
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
    'lib/invites.js'
  ], ['client', 'server']);

  // client

  api.addFiles([
    'lib/client/templates/user_invites.html',
    'lib/client/templates/user_invites.js'
  ], ['client']);

  // server

  api.addFiles([
    'lib/server/invites.js',
    'lib/server/publications.js'
  ], ['server']);

  // i18n languages (must come last)

  api.addFiles([
    'i18n/de.i18n.json',
    'i18n/en.i18n.json',
    'i18n/es.i18n.json',
    'i18n/fr.i18n.json',
    'i18n/it.i18n.json',
    'i18n/zh-CN.i18n.json'
  ], ['client', 'server']);

  // -------------------------------- 3. Variables to export --------------------------------

  api.export("Invites");

});
