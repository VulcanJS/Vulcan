Package.describe({
  summary: "Juice wrapper package",
  version: '0.1.0',
  name: "juice"
});

Npm.depends({
  juice: "0.4.0", 
});

Package.onUse(function (api) {

  api.add_files([
    'lib/juice.js',
  ], ['server']);
  
  api.export([
    'juice'
  ]);
});