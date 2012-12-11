var analyticsInit = function() {
  // Mixpanel
  if((mixpanelId=getSetting("mixpanelId")) && window.mixpanel.length===0 ){
    mixpanel.init(mixpanelId);
  }

  // GoSquared
  if (false && (goSquaredId = getSetting("goSquaredId"))) {
    var GoSquared = {};
    GoSquared.acct = goSquaredId;
    window._gstc_lt = +new Date;
    var d = document, g = d.createElement("script");
    g.type = "text/javascript";
    g.src = "//d1l6p2sc9645hc.cloudfront.net/tracker.js";
    var s = d.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(g, s);
  }

  // Clicky
  if((clickyId=getSetting("clickyId"))){
    clicky_site_ids = [];
    clicky_site_ids.push(clickyId);
    (function() {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = '//static.getclicky.com/js';
      ( document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0] ).appendChild( s );
    })();
  }

}

var analyticsRequest = function() {
  // Mixpanel
  if((mixpanelId=getSetting("mixpanelId")) && window.mixpanel.length===0 ){
    if(Meteor.user()){
      var currentUserEmail=getCurrentUserEmail();
      mixpanel.people.identify(currentUserEmail);
      mixpanel.people.set({
          'username': getDisplayName(Meteor.user()),
          '$last_login': new Date(), 
          '$created': moment(Meteor.user().createdAt)._d,
          '$email': currentUserEmail
      });
      mixpanel.register({
          'username': getDisplayName(Meteor.user()),
          'createdAt': moment(Meteor.user().createdAt)._d,
          'email': currentUserEmail
      });
      mixpanel.name_tag(currentUserEmail);
    }
  }

  // Clicky
  if(clickyId = getSetting("clickyId") && typeof clicky !== 'undefined'){
    clicky.log(encodeURIComponent(window.location.href));
  }

  // GoSquared
  if (goSquaredId = getSetting("goSquaredId") && typeof GoSquared !== 'undefined') {
    // GoSquared.DefaultTracker.TrackView(encodeURIComponent(window.location.href), Meteor.Router.page());
  }

  // Intercom
  if((intercomId=getSetting("intercomId")) && Meteor.user()){
    window.intercomSettings = {
      app_id: intercomId,
      email: currentUserEmail,
      created_at: moment(Meteor.user().createdAt).unix(),
      custom_data: {
        'profile link': 'http://'+document.domain+'/users/'+Meteor.user()._id
      },
      widget: {
        activator: '#Intercom',
        use_counter: true,
        activator_html: function ( obj ) {
          return obj.activator_html_functions.brackets();
        }
      }
    };
    IntercomInit();
  }
}