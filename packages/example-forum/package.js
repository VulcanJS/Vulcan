Package.describe({
  name: "example-forum",
  summary: "Vulcan forum package",
  version: '1.7.0',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    'fourseven:scss@4.5.0',

    // vulcan core
    'vulcan:core@1.7.0',

    // vulcan packages
    // 'vulcan:posts@1.7.0',
    // 'vulcan:comments@1.7.0',
    // 'vulcan:voting@1.7.0',
    'vulcan:accounts@1.7.0',
    'vulcan:email',
    'vulcan:forms',
    'vulcan:newsletter',
    // 'vulcan:notifications',
    // 'vulcan:getting-started',
    // 'vulcan:categories',
    'vulcan:events',
    'vulcan:embedly',
    // 'vulcan:api',
    // 'vulcan:rss',
    // 'vulcan:subscribe',

    // 'vulcan:base-components',
    // 'vulcan:base-styles',
    // 'vulcan:email-templates',

  ]);

  api.addAssets([
    'lib/assets/images/stackoverflow.png',
    'lib/assets/images/telescope.png',
  ], ['client']);

  api.addAssets([
    'lib/assets/content/read_this_first.md',
    'lib/assets/content/deploying.md', 'server',
    'lib/assets/content/customizing.md', 'server',
    'lib/assets/content/getting_help.md', 'server', 'server',
    'lib/assets/content/removing_getting_started_posts.md', 'server',
  ], ['server']);

  api.addFiles([
    // 'lib/stylesheets/bootstrap.css',
    'lib/stylesheets/main.scss'
  ], ['client']);

  api.mainModule("lib/server/main.js", "server");
  api.mainModule("lib/client/main.js", "client");

});
