Package.describe({
  summary: 'Telescope blank package – use as template for your own packages',
  version: '0.1.0',
  name: 'telescope-blank'
});

Npm.depends({
  // NPM package dependencies
});

Package.onUse(function (api) {

  // --------------------------- 1. Meteor packages dependencies ---------------------------

  // automatic (let the package specify where it's needed)

  api.use([
    'telescope-base',
    'telescope-lib',
    'telescope-i18n',
    'tap:i18n'
  ]);

  // both

  api.use([
    //
  ], ['client','server']);

  // client

  api.use([
    //
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
    'lib/both.js'
  ], ['client', 'server']);

  // client

  api.add_files([
    'lib/client/client_only.js'
  ], ['client']);

  // server

  api.add_files([
    'lib/server/server_only.js'
  ], ['server']);    

  // i18n languages (must come last)

  api.add_files([
    'i18n/de.i18n.json',
    'i18n/en.i18n.json',
    'i18n/es.i18n.json',
    'i18n/fr.i18n.json',
    'i18n/it.i18n.json',
    'i18n/zh-CN.i18n.json'
  ], ['client', 'server']);

  // -------------------------------- 3. Variables to export --------------------------------

  api.export([
    //
  ]);

});