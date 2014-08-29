Package.describe({summary: "Telescope email digest package"});

Npm.depends({later: "1.1.6"});

Package.onUse(function (api) {

  api.use([
    'telescope-lib', 
    'telescope-base', 
    'aldeed:simple-schema',
    'mrt:mailchimp'
  ], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'iron:router',
    'templating',
    'mrt:cookies'
  ], 'client');

  api.use([
    'percolatestudio:synced-cron',
    'cmather:handlebars-server',
    'meteorhacks:npm'
  ], ['server']);

  api.add_files([
    'lib/newsletter.js'
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