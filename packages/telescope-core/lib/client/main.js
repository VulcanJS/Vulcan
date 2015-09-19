// Session variables
Session.set('appIsReady', false);

Meteor.startup(function () {
  var link = {rel: "alternate", type: "application/rss+xml", href: "/feed.xml", title: i18n.t("new_posts")};
  DocHead.addLink(link);
});

// Global Subscriptions

Telescope.subsManager = new SubsManager({
  // cache recent 50 subscriptions
  cacheLimit: 50,
  // expire any subscription after 30 minutes
  expireIn: 30
});

Telescope.subscriptions.preload('settings');
Telescope.subscriptions.preload('currentUser');

FlowRouter.subscriptions = function() {
  var flow = this;
  Telescope.subscriptions.forEach(function (sub) {
    if (typeof sub === 'object'){
      flow.register(sub.subName, Meteor.subscribe(sub.subName, sub.subArguments));
    }else{
      flow.register(sub, Meteor.subscribe(sub));
    }
  });
};