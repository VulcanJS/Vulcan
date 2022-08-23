Package.describe({
  name: 'vulcan:i18n-es-es',
  summary: 'Vulcan i18n package (es_ES)',
  version: '1.16.9',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.use(['vulcan:core@=1.16.9']);

  api.addFiles(['lib/es_ES.js'], ['client', 'server']);
});
