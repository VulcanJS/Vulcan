Package.describe({
  summary: "Hanoi Massive Facebook Parser",
  version: '0.1.0',
  name: "massivites-parser"
});

Package.onUse(function(api) {

  api.use([
    'iron:router',
    'telescope-base',
    'telescope-lib',
    'coffeescript',
    'accounts-base'
  ], ['client', 'server']);

  api.use([
    'templating'
  ], ['client']);

  api.add_files([
    'lib/client/templates/parser-page.html',
    'lib/client/templates/parser-page.coffee',
  ], ['client']);

  api.add_files([
    'lib/both/routes.coffee',
    'lib/both/base.coffee'
  ], ['server', 'client']);

  api.add_files([
    'lib/server/parseFacebookFeed.coffee'
  ], ['server']);

  api.export([
    'adminNav'
  ]);
});