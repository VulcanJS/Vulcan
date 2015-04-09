Package.describe({
  summary: "Telescope library package",
  version: '0.2.9',
  name: "telescope-lib"
});

Package.onUse(function (api) {

  api.use([
    'underscore'
  ], ['client', 'server']);

  api.use([
    'jquery'
  ], 'client');

  api.add_files([
    'lib/lib.js',
    'lib/deep.js',
    'lib/deep_extend.js',
    'lib/autolink.js',
    'lib/permissions.js'
  ], ['client', 'server']);

  api.add_files(['lib/client/jquery.exists.js'], ['client']);

  api.export([
    'deepExtend',
    'camelToDash',
    'dashToCamel',
    'camelCaseify',
    'removeSetting',
    'getThemeSetting',
    'getSiteUrl',
    'trimWords',
    'can',
    '_',
    'capitalise'
  ]);
});
