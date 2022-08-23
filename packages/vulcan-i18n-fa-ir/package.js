Package.describe({
  name: 'vulcan:i18n-fa-ir',
  summary: 'Vulcan i18n package (fa_IR)',
  version: '1.16.9',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.use(['vulcan:core@=1.16.9']);

  api.addFiles(['lib/fa_IR.js'], ['client', 'server']);
});
