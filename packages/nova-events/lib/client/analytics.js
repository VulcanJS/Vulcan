import Telescope from 'meteor/nova:lib';
import Events from '../collection.js';

Events.analyticsRequest = function() {
  // Google Analytics
  if (typeof window.ga !== 'undefined'){
    window.ga('send', 'pageview', {
      'page': window.location.pathname
    });
  }
};

Events.analyticsInit = function() {

  // Google Analytics
  if (googleAnalyticsId = Telescope.settings.get("googleAnalyticsId")){

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    var cookieDomain = document.domain === "localhost" ? "none" : "auto";

    window.ga('create', googleAnalyticsId, cookieDomain);

  }

  // trigger first request once analytics are initialized
  Events.analyticsRequest();

};

Events.analyticsInit();

