Package.describe({
  name: "dcsan:topicheader",
  version: "0.0.1",
  summary: "topicHeader content embed in telescope"
})

Package.on_use(function (api) {

  both = ['client', 'server'];

  api.use([
    'telescope-lib', 
    'telescope-base',
    'coffeescript',
    'aldeed:autoform',
    'aldeed:collection2',
    'aldeed:simple-schema',
    'reactive-var',
  ], both);

  api.use([
    'ui',
    'templating',
  ], 'client' );

  api.add_files([
    'lib/flashcardSchema.js'
  ], both)

  api.add_files([
    'lib/client/topicHeader.html',
    'lib/client/topicHeader.css',
    'lib/client/topicHeader.coffee'
  ], 'client');

  api.add_files([
    'lib/server/topicServer.coffee'
  ], 'server');

  api.add_files([
    'lib/collections/Topics.coffee'
  ], both);

  api.export([
    'Topics'
  ], both );

});