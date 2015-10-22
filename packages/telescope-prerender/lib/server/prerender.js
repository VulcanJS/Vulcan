if (Settings.get("prerenderIOToken")) {
  var prerender = Npm.require('prerender-node')
    .set('protocol', 'http')
    .set('host', Settings.get("siteUrl").replace("http://", "").replace("/", ""))
    .set('prerenderToken', Settings.get("prerenderIOToken"));

  Meteor.startup(function() {
    WebApp.rawConnectHandlers.use(prerender);
  });
}