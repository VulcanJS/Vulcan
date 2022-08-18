Package.describe({
  name: 'vulcan:email',
  summary: 'Vulcan email package',
  version: '1.16.8',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.use(['vulcan:lib@=1.16.8']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

  api.addAssets(['lib/server/templates/template_error.handlebars'], ['server']);
});
