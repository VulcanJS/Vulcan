if (Settings.get("prerenderIOToken")) {
  
  siteURL = Settings.get("siteUrl");
  porto = 'http';
  var prerender = Npm.require('prerender-node');
  
  if( siteURL.indexOf('https') >= 0 ){//checking for https
    prerender.set('protocol', 'https');
    proto += 's';
  }
  else
    prerender.set('protocol', 'http');
    
  prerender.set('host', siteURL.replace(proto+"://", "").replace("/", "") )
    .set('prerenderToken', Settings.get("prerenderIOToken"));

  Meteor.startup(function() {
    WebApp.rawConnectHandlers.use(prerender);
  });
}
