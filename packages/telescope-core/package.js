Package.describe({
  name: "telescope:core",
  summary: "Telescope core package",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  var packages = [
    'telescope:lib@0.21.1', //  no dependencies
    'telescope:messages@0.21.1', // lib
    'telescope:i18n@0.21.1', // lib
    'telescope:events@0.21.1', // lib, i18n
    'telescope:settings@0.21.1', // lib, i18n
    'telescope:users@0.21.1', // lib, i18n, settings
    'telescope:comments@0.21.1', // lib, i18n, settings, users
    'telescope:posts@0.21.1' // lib, i18n, settings, users, comments
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
    'lib/client/templates/modules/module.html',
    'lib/client/templates/modules/module.js',
    'lib/client/templates/modules/modules.html',
    'lib/client/templates/modules/modules.js',
    'lib/client/templates/admin/admin_menu.html',
    'lib/client/templates/admin/admin_menu.js',
    'lib/client/templates/admin/admin_wrapper.html',
    'lib/client/templates/admin/admin_wrapper.js',
    'lib/client/templates/common/css.html',
    'lib/client/templates/common/css.js',
    'lib/client/templates/common/footer.html',
    'lib/client/templates/common/footer.js',
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
    'lib/client/templates/nav/nav.html',
    'lib/client/templates/nav/nav.js',
    'lib/client/templates/nav/submit_button.html',
    'lib/client/templates/nav/user_menu.html',
    'lib/client/templates/nav/user_menu.js',
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

  api.addFiles([
    "i18n/ar.i18n.json",
    "i18n/bg.i18n.json",
    "i18n/de.i18n.json",
    "i18n/el.i18n.json",
    "i18n/en.i18n.json",
    "i18n/es.i18n.json",
    "i18n/fr.i18n.json",
    "i18n/it.i18n.json",
    "i18n/nl.i18n.json",
    "i18n/pl.i18n.json",
    "i18n/pt-BR.i18n.json",
    "i18n/ro.i18n.json",
    "i18n/ru.i18n.json",
    "i18n/sv.i18n.json",
    "i18n/tr.i18n.json",
    "i18n/vi.i18n.json",
    "i18n/zh-CN.i18n.json"
  ], ["client", "server"]);

  api.export([
    'coreSubscriptions'
  ]);
});
