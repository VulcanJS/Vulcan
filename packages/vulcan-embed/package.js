Package.describe({
  name: 'vulcan:embed',
  summary: 'Vulcan Embed package',
  version: '1.16.9',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.use(['http@2.0.0', 'vulcan:core@=1.16.9', 'fourseven:scss@4.12.0']);

  api.addFiles(['lib/stylesheets/embedly.scss'], ['client']);

  api.mainModule('lib/client/main.js', 'client');
  api.mainModule('lib/server/main.js', 'server');
});
