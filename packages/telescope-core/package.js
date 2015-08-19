Package.describe({
  name: "telescope:core",
  summary: "Telescope core package",
  version: "0.23.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  var packages = [
    'telescope:lib@0.23.0', //  no dependencies
    'telescope:messages@0.23.0', // lib
    'telescope:i18n@0.23.0', // lib
    'telescope:events@0.23.0', // lib, i18n
    'telescope:settings@0.23.0', // lib, i18n
    'telescope:users@0.23.0', // lib, i18n, settings
    'telescope:comments@0.23.0', // lib, i18n, settings, users
    'telescope:posts@0.23.0' // lib, i18n, settings, users, comments
  ];

  api.use(packages);
  
  api.imply(packages);

  api.addFiles([
    'lib/router/config.js',
    'lib/router/filters.js',
    'lib/router/admin.js',
    'lib/router/server.js',
    'lib/config.js',
    'lib/modules.js',
    'lib/vote.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/handlebars.js',
    'lib/client/main.html',
    'lib/client/main.js',
    'lib/client/templates/modules/modules.html',
    'lib/client/templates/modules/modules.js',
    'lib/client/templates/admin/admin_menu.html',
    'lib/client/templates/admin/admin_menu.js',
    'lib/client/templates/admin/admin_wrapper.html',
    'lib/client/templates/admin/admin_wrapper.js',
    'lib/client/templates/common/css.html',
    'lib/client/templates/common/css.js',
    'lib/client/templates/common/footer_code.html',
    'lib/client/templates/common/footer_code.js',
    'lib/client/templates/common/layout.html',
    'lib/client/templates/common/layout.js',
    'lib/client/templates/errors/already_logged_in.html',
    'lib/client/templates/errors/loading.html',
    'lib/client/templates/errors/loading.js',
    'lib/client/templates/errors/no_account.html',
    'lib/client/templates/errors/no_account.js',
    'lib/client/templates/errors/no_invite.html',
    'lib/client/templates/errors/no_invite.js',
    'lib/client/templates/errors/no_rights.html',
    'lib/client/templates/errors/not_found.html',
    'lib/client/templates/forms/urlCustomType.html',
    'lib/client/templates/forms/urlCustomType.js',
    'lib/client/templates/nav/logo.html',
    'lib/client/templates/nav/logo.js',
    'lib/client/templates/nav/mobile_nav.html',
    'lib/client/templates/nav/mobile_nav.js',
    'lib/client/templates/nav/header.html',
    'lib/client/templates/nav/header.js',
    'lib/client/templates/nav/submit_button.html',
    'lib/client/templates/menu/menu.scss',
    'lib/client/templates/menu/menu_component.html',
    'lib/client/templates/menu/menu_component.js'
  ], 'client');

  // static assets; needs cleanup

  api.addFiles([
    'public/img/default-avatar.png',
    'public/img/loading-balls.svg',
    'public/img/loading.svg',
  ], 'client');

  api.addFiles([
    'lib/server/start.js'
  ], ['server']);

  var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "it", "ja", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sv", "th", "tr", "vi", "zh-CN"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);

});
