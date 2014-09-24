Package.describe({
  summary: "A notifications engine used by Telescope",
  version: "0.0.1",
  git: " \* Fill me in! *\ ",
  name: 'notifications' //who would be the author? Does Telescope have an account name?
});

Package.onUse(function(api) {

  api.use(['standard-app-packages']); //TODO: reduce this to the minimum requirements.

  //if iron route is present add 'seen route' logic
  api.use(['iron:router'], {week: true}); 

  api.addFiles('lib/notifications.js');

  api.addFiles('lib/client.js', 'client');

  api.addFiles('lib/server.js', 'server');

  api.export([
    'Notifications',
    'NotificationsHelpers'
  ]);

  api.export([
    'createNotification'
  ], 'server');
});
