Package.describe("Telescope email digest package");

Package.on_use(function (api) {

  api.use([
    'telescope-lib', 
    'telescope-base', 
    'simple-schema',
    'mailchimp'
  ], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'iron-router',
    'templating',
    'cookies'
  ], 'client');

  api.use([
    'synced-cron',
    'handlebars-server',
    'npm'
  ], ['server']);

  api.add_files([
    'lib/digest.js'
  ], ['client', 'server']);

  api.add_files([
    'lib/client/newsletter_banner.html',
    'lib/client/newsletter_banner.js',
    'lib/client/newsletter_banner.css'
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
  
  api.export([

  ]);
});