Package.describe({
  name: 'vulcan:i18n-en-us',
  summary: 'Vulcan i18n package (en_US)',
  version: '1.13.2',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  api.use(['vulcan:core@1.13.2']);

  api.addFiles(['lib/en_US.js'], ['client', 'server']);
});
