Package.describe({
  name: 'vulcan:i18n-en-us',
  summary: 'Vulcan i18n package (en_US)',
  version: '1.16.9',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.use(['vulcan:core@=1.16.9']);

  api.addFiles(['lib/en_US.js'], ['client', 'server']);
});
