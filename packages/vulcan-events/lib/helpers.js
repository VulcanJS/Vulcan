import { getSetting } from 'meteor/vulcan:core';
import Events from './collection.js';
/*

  We provide a special support for Google Analytics.
  
  If you want to enable GA page viewing / tracking, go to
  your settings file and update the "public > googleAnalyticsId" 
  field with your GA unique identifier (UA-xxx...).

*/

export function sendGoogleAnalyticsRequest () {
  if (window && window.ga) {
    window.ga('send', 'pageview', {
      'page': window.location.pathname
    });
  }
  return {}
}

export const initGoogleAnalytics = () => {

  // get the google analytics id from the settings
  const googleAnalyticsId = getSetting("googleAnalyticsId");
  
  // the google analytics id exists & isn't the placeholder from sample_settings.json
  if (googleAnalyticsId && googleAnalyticsId !== "foo123") {

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    const cookieDomain = document.domain === "localhost" ? "none" : "auto";

    window.ga('create', googleAnalyticsId, cookieDomain);

    // trigger first request once analytics are initialized
    sendGoogleAnalyticsRequest();
  }
};


// collection based logging
Events.log = function (event) {

  // if event is supposed to be unique, check if it has already been logged
  if (!!event.unique && !!Events.findOne({name: event.name})) {
    return;
  }

  event.createdAt = new Date();

  Events.insert(event);

};
