Package.describe({
  summary: "Extracts article contents and use the information to embed into telescope",
  version: "0.0.1",
  git: "https://bitbucket.org/kvindasAlivebox/fitnews2-fs/branch/new-package-embedlyplus"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.3.1');
  api.use(['telescope-lib', 'telescope-base'], ['client', 'server']);
  api.use([
    'jquery',
    'underscore',
    'iron:router',
    'templating'
  ], 'client');

  api.addFiles(
    [
      'client/post_submit_plus.html',
      'client/post_submit_plus.js',
      'client/post_submit_plus_addons.html',
      'client/post_submit_plus_addons.js'
    ], 'client'
  );

  api.addFiles(
    [
      'client/post_thumbnail.css',
      'client/post_thumbnail.html',
      'client/post_thumbnail.js',
      'client/post_video.html',
      'client/post_video.js'
    ], 'client'
  );


  api.addFiles(
    [
      'server/get_embedly_data.js'
    ], 'server'
  );

  api.addFiles('client/module-embedly-plus.js');
});

//

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('alivebox:telescope-module-embedly-plus');
  api.addFiles('test/module-embedly-plus-tests.js');
});
