Package.describe({
  name: "telescope:newsletter",
  summary: "Telescope email newsletter package",
  version: "0.22.1",
  git: "https://github.com/TelescopeJS/telescope-newsletter.git"
});

Npm.depends({
  "html-to-text": "0.1.0"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'telescope:core@0.22.1',
    'miro:mailchimp@1.0.4',
  ]);

  api.addFiles([
    'package-tap.i18n',
    'lib/newsletter.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/templates/newsletter_banner.html',
    'lib/client/templates/newsletter_banner.js',
    'lib/client/stylesheets/newsletter_banner.scss'
  ], ['client']);

  api.addFiles([
    'lib/server/campaign.js',
    'lib/server/cron.js',
    'lib/server/mailchimp.js',
    'lib/server/routes.js',
    'lib/server/templates/emailDigest.handlebars',
    'lib/server/templates/emailDigestConfirmation.handlebars',
    'lib/server/templates/emailPostItem.handlebars'
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
    'resetNewsletterSchedule'
  ]);
});
