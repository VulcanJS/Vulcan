Package.describe({
  summary: 'Telescope Single Day package',
  version: '0.1.0',
  name: 'telescope-singleday'
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
    'tap:i18n',
    'iron:router'
  ]);

  // client

  api.use([
    'jquery',
    'underscore',
    'templating' 
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
    'lib/routes.js',
    'lib/singleday.js'
  ], ['client', 'server']);

  // client

  api.add_files([
    'lib/client/templates/single_day.html',
    'lib/client/templates/single_day.js',
    'lib/client/templates/single_day_nav.html',
    'lib/client/templates/single_day_nav.js'
  ], ['client']);

  // server

  api.add_files([
  ], ['server']);    

  // i18n languages (must come last)

  api.add_files([
    'i18n/bg.i18n.json',
    'i18n/de.i18n.json',
    'i18n/en.i18n.json',
    'i18n/es.i18n.json',
    'i18n/fr.i18n.json',
    'i18n/it.i18n.json',
    'i18n/tr.i18n.json',
    'i18n/zh-CN.i18n.json'
  ], ['client', 'server']);

  // -------------------------------- 3. Variables to export --------------------------------

  api.export([
    'getDigestURL',
    'PostsSingledayController'
  ]);

});
