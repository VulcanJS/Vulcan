// Session variables
Session.set('appIsReady', false);

Meteor.startup(function () {
  $('#rss-link').attr('title', i18n.t('new_posts'));
});

// AutoForm.debug();


// Global Subscriptions

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

// Template extension stuff for backwards compatibility

_.each(templates, function (replacement, original) {
  Template[replacement].replaces(original);
});
