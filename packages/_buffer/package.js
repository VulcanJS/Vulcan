Package.describe({
  name: "buffer"
});

Package.onUse( function(api) {
  
  api.use([
    'ecmascript'
  ]);

  api.addFiles([
    'buffer.js'
  ], ['client']);

});
