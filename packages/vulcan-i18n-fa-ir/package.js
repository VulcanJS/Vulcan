Package.describe({
  name: 'vulcan:i18n-fa-ir',
  summary: 'Vulcan i18n package (fa_IR)',
  version: '1.15.1',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  api.use(['vulcan:core@=1.15.1']);

  api.addFiles(['lib/fa_IR.js'], ['client', 'server']);
});
