Router.setTemplateNameConverter(function (str) { return str; });

preloadSubscriptions.push('settings');
preloadSubscriptions.push('currentUser');

Router.configure({
  layoutTemplate: getTemplate('layout'),
  loadingTemplate: getTemplate('loading'),
  notFoundTemplate: getTemplate('notFound'),
  waitOn: function () {
    return _.map(preloadSubscriptions, function(sub){
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
    _.each(preloadSubscriptions, function(sub){
      router.subscribe(sub);
    });
  });
}
