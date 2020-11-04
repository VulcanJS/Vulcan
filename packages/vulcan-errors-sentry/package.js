Package.describe({
  name: 'vulcan:errors-sentry',
  summary: 'Vulcan Sentry error tracking package',
  version: '1.16.0',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  

  api.use(['ecmascript', 'vulcan:core@=1.16.0', 'vulcan:users@=1.16.0', 'vulcan:errors@=1.16.0']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
