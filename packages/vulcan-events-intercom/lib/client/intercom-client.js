import { getSetting, /* addCallback, Utils */ } from 'meteor/vulcan:core';
import {
  // addPageFunction,
  addInitFunction,
  addIdentifyFunction,
  // addTrackFunction,
} from 'meteor/vulcan:events';

/*

Identify User

*/
function intercomIdentify(currentUser) {
  // eslint-disable-next-line no-undef
  intercomSettings = {
    app_id: getSetting('intercom.appId'),
    name: currentUser.displayName,
    email: currentUser.email,
    created_at: currentUser.createdAt,
    user_id: currentUser._id,
    pageUrl: currentUser.pageUrl,
  };
  (function() {
    var w = window;
    var ic = w.Intercom;
    if (typeof ic === 'function') {
      // ic('reattach_activator');
      // eslint-disable-next-line no-undef
      ic('update', intercomSettings);
    } else {
      intercomInit();
    }
  })();
}
addIdentifyFunction(intercomIdentify);

/*

Track Event

*/
// function segmentTrack(eventName, eventProperties) {
//   analytics.track(eventName, eventProperties);
// }
// addTrackFunction(segmentTrack);

/*

Init Snippet

*/
function intercomInit() {
  window.intercomSettings = {
    app_id: getSetting('intercom.appId'),
  };
  (function() {
    var w = window;
    var ic = w.Intercom;
    if (typeof ic === 'function') {
      ic('reattach_activator');
      // eslint-disable-next-line no-undef
      ic('update', intercomSettings);
    } else {
      var d = document;
      var i = function() {
        i.c(arguments);
      };
      i.q = [];
      i.c = function(args) {
        i.q.push(args);
      };
      w.Intercom = i;
      // eslint-disable-next-line no-inner-declarations
      function l() {
        var s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = `https://widget.intercom.io/widget/${getSetting('intercom.appId')}`;
        var x = d.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
      }
      if (w.attachEvent) {
        w.attachEvent('onload', l);
      } else {
        w.addEventListener('load', l, false);
      }
    }
  })();
}
addInitFunction(intercomInit);
