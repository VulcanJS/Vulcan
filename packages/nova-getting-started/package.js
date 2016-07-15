Package.describe({
  name: "nova:getting-started",
  summary: "Getting started posts",
  version: '0.26.4-nova',
  git: "https://github.com/TelescopeJS/telescope-getting-started.git"
});

Npm.depends({
  // NPM package dependencies
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:core@0.26.4-nova',
    'nova:posts@0.26.4-nova',
    'nova:comments@0.26.4-nova',
    'nova:users@0.26.4-nova'
  ]);

  // both

  api.addFiles([
    'lib/getting_started.js'
  ], ['client', 'server']);

  // client

  api.addAssets([
    'content/images/stackoverflow.png',
    'content/images/telescope.png'
  ], ['client']);

  // server

  api.addFiles([
    'lib/server/dummy_content.js'
  ], ['server']);

  api.addAssets('content/read_this_first.md', 'server');
  api.addAssets('content/deploying.md', 'server');
  api.addAssets('content/customizing.md', 'server');
  api.addAssets('content/getting_help.md', 'server', 'server');
  api.addAssets('content/removing_getting_started_posts.md', 'server');

});
