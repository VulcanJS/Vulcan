var fs = Npm.require('fs');
var path = Npm.require('path');

// We use this patch to avoid data injection failure during server-side rendering on Meteor 1.4
// All the credits for this package goes to Arunoda, Kadira's team & @rigconfig
// see https://github.com/meteor/meteor/issues/7992 

Package.describe({
  "summary": "A way to inject data to the client with initial HTML",
  "version": "2.0.1-nova-patch",
  "git": "https://github.com/meteorhacks/inject-data",
  "name": "meteorhacks:inject-data"
});

Package.onUse(function(api) {
  configure(api);
  api.export('InjectData', ['client', 'server']);
});

function configure (api) {
  api.versionsFrom('METEOR@0.9.3');

  api.use(['ejson', 'underscore'], ['server', 'client']);
  api.use('jquery', 'client');

  api.addFiles([
    'lib/inject.html',
  ], 'server', {isAsset: true});

  api.addFiles([
    'lib/namespace.js',
    'lib/utils.js',
  ], ['client', 'server']);

  api.addFiles([
    'lib/server.js'
  ], 'server');

  api.addFiles([
    'lib/client.js'
  ], 'client');
}
