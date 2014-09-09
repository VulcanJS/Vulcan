Package.describe({
  summary: "Allows auto recommendation of title and content on meteor Post",
  version: "0.0.1",
  git: "https://github.com/kvindasAB/Telescope/tree/new-package-auto-recommend-title-content"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.0.1');
  api.addFiles(['lib/auto-recommend.js', 'lib/auto-recommend-settings.js'], ['client','server']);

  api.use(['telescope-lib', 'telescope-base'], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'iron:router',
    'templating'
  ], 'client');

  api.export('AutoRecommendService');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('kvindas:telescope-module-auto-recommend');
  api.addFiles('tests/auto-recommend-tests.js');
});
