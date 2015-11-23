if (Settings.get('prerenderIOToken')) {
  
  var siteUrl = Settings.get('siteUrl') || Meteor.absoluteUrl();
  var protocol = siteUrl.indexOf('https') !== -1 ? 'https' : 'http'

  var prerender = Npm.require('')
    .set('protocol', protocol)
    .set('host', siteUrl.replace('http://', '').replace('/', ''))
    .set('prerenderToken', Settings.get('prerenderIOToken'));

  Meteor.startup(function() {
    WebApp.rawConnectHandlers.use(prerender);
  });
}