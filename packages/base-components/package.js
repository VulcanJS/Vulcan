Package.describe({
  name: "base-components",
  summary: "Telescope components package",
  version: "0.25.7",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:lib@0.25.7',
    'telescope:posts@0.25.7'
    // 'telescope:i18n@0.25.7',
    // 'telescope:settings@0.25.7',
    // 'telescope:users@0.25.7',
    // 'telescope:comments@0.25.7'
  ]);

  api.addFiles([
    'lib/components.js'
  ], ['client', 'server']);



});
