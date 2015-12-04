Package.describe({
  name: "telescope:core",
  summary: "Telescope core package",
  version: "0.25.5",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  var packages = [
    'telescope:lib@0.25.5', //  no dependencies
    'telescope:messages@0.25.5', // lib
    'telescope:i18n@0.25.5', // lib
    'telescope:events@0.25.5', // lib, i18n
    'telescope:settings@0.25.5', // lib, i18n
    'telescope:users@0.25.5', // lib, i18n, settings
    'telescope:comments@0.25.5', // lib, i18n, settings, users
    'telescope:posts@0.25.5' // lib, i18n, settings, users, comments
  ];

  api.use(packages);
  
  api.imply(packages);

  api.addFiles([
    'lib/modules.js',
    'lib/vote.js',
    'lib/subscriptions.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/handlebars.js',
    'lib/client/main.html',
    'lib/client/main.js',
    'lib/client/scripts/jquery.quickfit.js',
    'lib/client/templates/modules/modules.html',
    'lib/client/templates/modules/modules.js',
    'lib/client/templates/admin/admin_menu.html',
    'lib/client/templates/admin/admin_menu.js',
    'lib/client/templates/admin/admin_wrapper.html',
    'lib/client/templates/common/css.html',
    'lib/client/templates/common/css.js',
    'lib/client/templates/common/footer_code.html',
    'lib/client/templates/common/footer_code.js',
    'lib/client/templates/common/loader.html',
    'lib/client/templates/common/checker.html',
    'lib/client/templates/common/checker.js',
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
    'lib/client/templates/errors/no_rights.js',
    'lib/client/templates/errors/not_found.html',
    'lib/client/templates/forms/urlCustomType.html',
    'lib/client/templates/forms/urlCustomType.js',
    'lib/client/templates/nav/logo.html',
    'lib/client/templates/nav/logo.js',
    'lib/client/templates/nav/mobile_nav.html',
    'lib/client/templates/nav/mobile_nav.js',
    'lib/client/templates/nav/header.html',
    'lib/client/templates/nav/header.js',
    'lib/client/templates/nav/submit_button.html'
  ], 'client');

  api.addAssets([
    'public/img/loading.svg',
  ], 'client');

  api.addFiles([
    'lib/server/start.js',
    'lib/server/fastrender.js',
    'lib/server/routes.js'
  ], ['server']);

  var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);

});
