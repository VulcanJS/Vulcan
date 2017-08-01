Package.describe({
  name: "example-forum",
  summary: "Vulcan forum package",
  version: '1.6.1',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    // vulcan core
    'vulcan:core@1.6.1',

    // vulcan packages
    'vulcan:posts@1.6.1',
    'vulcan:comments@1.6.1',
    'vulcan:voting@1.6.1',
    'vulcan:accounts@1.6.1',
    'vulcan:email',
    'vulcan:forms',
    'vulcan:newsletter',
    'vulcan:notifications',
    'vulcan:getting-started',
    'vulcan:categories',
    'vulcan:events',
    'vulcan:embedly',
    'vulcan:api',
    'vulcan:rss',
    'vulcan:subscribe',

    'vulcan:base-components',
    'vulcan:base-styles',
    'vulcan:email-templates',

  ]);

  // api.mainModule("lib/server.js", "server");
  // api.mainModule("lib/client.js", "client");

});
