Package.describe({
  name: 'vulcan:emotion',
  summary: 'Add Emotion to Vulcan.',
  version: '1.16.1',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.use(['vulcan:core@=1.16.1']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
