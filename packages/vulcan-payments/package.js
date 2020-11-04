Package.describe({
  name: 'vulcan:payments',
  summary: 'Vulcan payments package',
  version: '1.16.0',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  

  api.use(['promise', 'vulcan:core@=1.16.0', 'fourseven:scss@4.12.0']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

  api.addFiles(['lib/stylesheets/style.scss']);
});
