Package.describe({summary: "Telescope messages package"});

Package.onUse(function(api) {
  api.use([
    'minimongo',
    'templating',
    'telescope-base'
  ], 'client');

  api.addFiles([
    'lib/client/messages.js',

    'lib/client/templates/messages.html',
    'lib/client/templates/messages.js',
    'lib/client/templates/message_item.html',
    'lib/client/templates/message_item.js'
  ], 'client');

  api.export('Messages', 'client');
});
