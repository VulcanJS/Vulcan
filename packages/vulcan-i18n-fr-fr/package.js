Package.describe({
  name: 'vulcan:i18n-fr-fr',
  summary: 'Vulcan i18n package (fr_FR)',
  version: '1.16.9',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.use(['vulcan:core@=1.16.9']);

  api.addFiles(['lib/fr_FR.js'], ['client', 'server']);
});
