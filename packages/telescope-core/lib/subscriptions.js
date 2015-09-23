// note: this is shared between client/server in order to enable fast-render to auto-detect subscriptions

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