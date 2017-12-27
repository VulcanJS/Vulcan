import { getSetting, addCallback, Utils } from 'meteor/vulcan:core';
import {
  addPageFunction,
  addInitFunction,
  addIdentifyFunction,
  addTrackFunction,
} from 'meteor/vulcan:events';

/*

Track Page

*/
function segmentTrackPage(route) {
  const { name, path } = route;
  const properties = {
    url: Utils.getSiteUrl().slice(0, -1) + path,
    path,
  };
  window.analytics.page(null, name, properties);
  return {};
}
addPageFunction(segmentTrackPage);

/*

Identify User

*/
function segmentIdentify(currentUser) {
  window.analytics.identify(currentUser._id, {
    email: currentUser.email,
    pageUrl: currentUser.pageUrl,
  });
}
addIdentifyFunction(segmentIdentify);

/*

Track Event

*/
function segmentTrack(eventName, eventProperties) {
  analytics.track(eventName, eventProperties);
}
addTrackFunction(segmentTrack);

/*

Init Snippet

*/
function segmentInit() {
  !(function() {
    var analytics = (window.analytics = window.analytics || []);
    if (!analytics.initialize)
      if (analytics.invoked)
        window.console &&
          console.error &&
          console.error('Segment snippet included twice.');
      else {
        analytics.invoked = !0;
        analytics.methods = [
          'trackSubmit',
          'trackClick',
          'trackLink',
          'trackForm',
          'pageview',
          'identify',
          'reset',
          'group',
          'track',
          'ready',
          'alias',
          'debug',
          'page',
          'once',
          'off',
          'on',
        ];
        analytics.factory = function(t) {
          return function() {
            var e = Array.prototype.slice.call(arguments);
            e.unshift(t);
            analytics.push(e);
            return analytics;
          };
        };
        for (var t = 0; t < analytics.methods.length; t++) {
          var e = analytics.methods[t];
          analytics[e] = analytics.factory(e);
        }
        analytics.load = function(t) {
          var e = document.createElement('script');
          e.type = 'text/javascript';
          e.async = !0;
          e.src =
            ('https:' === document.location.protocol ? 'https://' : 'http://') +
            'cdn.segment.com/analytics.js/v1/' +
            t +
            '/analytics.min.js';
          var n = document.getElementsByTagName('script')[0];
          n.parentNode.insertBefore(e, n);
        };
        analytics.SNIPPET_VERSION = '4.0.0';
        analytics.load(getSetting('segment.clientKey'));
      }
  })();
}
addInitFunction(segmentInit);