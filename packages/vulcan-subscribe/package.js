Package.describe({
  name: 'vulcan:subscribe',
  summary: 'Subscribe to posts, users, etc. to be notified of new activity',
  version: '1.8.5',
  git: 'https://github.com/VulcanJS/Vulcan.git'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.5.2');

  api.use([
    'vulcan:core@1.8.5'
    // dependencies on posts, categories are done with nested imports to reduce explicit dependencies
  ]);

  api.use(['example-forum@1.8.3'], { weak: true });

  api.mainModule('lib/modules.js', ['client']);
  api.mainModule('lib/modules.js', ['server']);
});
