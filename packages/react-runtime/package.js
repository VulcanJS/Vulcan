Package.describe({
  name: 'react-runtime',
  version: '0.14.99'
})

Package.onUse(function(api) {
  api.use('ecmascript')
  api.addFiles('react.js')
})

