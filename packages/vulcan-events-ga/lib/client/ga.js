import { getSetting } from 'meteor/vulcan:core';
import { addPageFunction, addInitFunction, addTrackFunction } from 'meteor/vulcan:events';

/*

  We provide a special support for Google Analytics.
  
  If you want to enable GA page viewing / tracking, go to
  your settings file and update the 'public > googleAnalytics > apiKey' 
  field with your GA unique identifier (UA-xxx...).

*/

function googleAnaticsTrackPage() {
  if (window && window.ga) {
    window.ga('send', 'pageview', {
      page: window.location.pathname,
    });
  }
  return {};
}
// add client-side callback: log a ga request on page view
addPageFunction(googleAnaticsTrackPage);

function googleAnaticsTrackEvent(name, properties, currentUser) {
  const { category = name, action = name, label = name, value } = properties;
  if (window && window.ga) {
    window.ga('send', {
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value,
    });
  }
  return {};
}
// add client-side callback: log a ga request on page view
addTrackFunction(googleAnaticsTrackEvent);

function googleAnalyticsInit() {
  // get the google analytics id from the settings
  const googleAnalyticsId = getSetting('googleAnalytics.apiKey');

  // the google analytics id exists & isn't the placeholder from sample_settings.json
  if (googleAnalyticsId && googleAnalyticsId !== 'foo123') {
    (function(i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      (i[r] =
        i[r] ||
        function() {
          (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(
      window,
      document,
      'script',
      '//www.google-analytics.com/analytics.js',
      'ga'
    );

    const cookieDomain = document.domain === 'localhost' ? 'none' : 'auto';

    window.ga('create', googleAnalyticsId, cookieDomain);

    // trigger first request once analytics are initialized
    googleAnaticsTrackPage();
  }
}

// init google analytics on the client module
addInitFunction(googleAnalyticsInit);
