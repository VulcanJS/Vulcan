Router.setTemplateNameConverter(function (str) { return str; });

Telescope.subscriptions.preload('settings');
Telescope.subscriptions.preload('currentUser');

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'not_found',
  waitOn: function () {
    return _.map(Telescope.subscriptions, function(sub){
      // can either pass strings or objects with subName and subArguments properties
      if (typeof sub === 'object'){
        Meteor.subscribe(sub.subName, sub.subArguments);
      }else{
        Meteor.subscribe(sub);
      }
    });
  }
});

Telescope.controllers = {};

Telescope.subsManager = new SubsManager({
  // cache recent 50 subscriptions
  cacheLimit: 50,
  // expire any subscription after 30 minutes
  expireIn: 30
});
