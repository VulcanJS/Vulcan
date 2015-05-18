Router.setTemplateNameConverter(function (str) { return str; });

Telescope.subscriptions.preload('settings');
Telescope.subscriptions.preload('currentUser');

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  not_foundTemplate: 'not_found',
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

// adding common subscriptions that's need to be loaded on all the routes
// notification does not included here since it is not much critical and
// it might have considerable amount of docs
if(Meteor.isServer) {
  FastRender.onAllRoutes(function() {
    var router = this;
    _.each(Telescope.subscriptions, function(sub){
      router.subscribe(sub);
    });
  });
}

Telescope.controllers = {};