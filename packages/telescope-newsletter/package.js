Package.describe({
  summary: "Telescope email newsletter package",
  version: '0.1.0',
  name: "telescope-newsletter"
});

Npm.depends({
  "html-to-text": "0.1.0"
});

Package.onUse(function (api) {

  api.use([
    'telescope-lib',
    'telescope-base',
    'aldeed:simple-schema',
    'iron:router',
    'miro:mailchimp',
    'tap:i18n',
    'fourseven:scss'
  ], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'templating',
    'mrt:cookies'
  ], 'client');

  api.use([
    'percolatestudio:synced-cron',
    'cmather:handlebars-server',
    'meteorhacks:npm'
  ], ['server']);

  api.add_files([
    'package-tap.i18n',
    'lib/newsletter.js'
  ], ['client', 'server']);

  api.add_files([
    'lib/client/templates/newsletter_banner.html',
    'lib/client/templates/newsletter_banner.js',
    'lib/client/stylesheets/newsletter_banner.scss'
  ], ['client']);

  api.add_files([
    'lib/server/campaign.js',
    'lib/server/cron.js',
    'lib/server/mailchimp.js',
    'lib/server/routes.js',
    'lib/server/templates/emailDigest.handlebars',
    'lib/server/templates/emailDigestConfirmation.handlebars',
    'lib/server/templates/emailPostItem.handlebars'
  ], ['server']);

  api.add_files([
    "i18n/de.i18n.json",
    "i18n/en.i18n.json",
    "i18n/es.i18n.json",
    "i18n/fr.i18n.json",
    "i18n/it.i18n.json",
    "i18n/zh-CN.i18n.json",
  ], ["client", "server"]);

  api.export([
    'resetNewsletterSchedule'
  ]);
});