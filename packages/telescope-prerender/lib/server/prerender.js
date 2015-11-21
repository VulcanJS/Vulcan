if (Settings.get("prerenderIOToken")) {
  var siteUrl = Settings.get("siteUrl") || Meteor.absoluteUrl();
  var prerender = Npm.require('prerender-node')
    .set('protocol', 'http')
    .set('host', siteUrl.replace("http://", "").replace("/", ""))
    .set('prerenderToken', Settings.get("prerenderIOToken"));

  Meteor.startup(function() {
    WebApp.rawConnectHandlers.use(prerender);
  });
}