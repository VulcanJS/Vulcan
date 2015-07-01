Package.describe({
  name: "telescope:messages",
  summary: "Telescope messages package",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/telescope-messages.git"
});

Package.onUse(function(api) {
  
  api.versionsFrom("METEOR@1.0");

  api.use(['telescope:lib@0.21.1']);

  api.addFiles([
    'lib/client/messages.js',

    'lib/client/templates/messages.html',
    'lib/client/templates/messages.js',
    'lib/client/templates/message_item.html',
    'lib/client/templates/message_item.js'
  ], 'client');

  api.export('Messages', 'client');
});
