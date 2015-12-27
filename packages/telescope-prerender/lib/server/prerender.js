if (Settings.get('prerenderIOToken')) {

  var siteUrl = Settings.get('siteUrl') || Meteor.absoluteUrl();
  var protocol = siteUrl.indexOf('https') !== -1 ? 'https' : 'http';
  var host = siteUrl.replace(/https?:\/\//, '').replace('/', '');

  var prerender = Npm.require('prerender-node')
    .set('protocol', protocol)
    .set('host', host)
    .set('prerenderToken', Settings.get('prerenderIOToken'));

  Meteor.startup(function() {
    WebApp.rawConnectHandlers.use(prerender);
  });
}