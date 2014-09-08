Meteor.startup(function () {
  if(Meteor.user() && isAdmin(Meteor.user())){
    HTTP.get(url, [options], [asyncCallback])
    Session.set('updateMessage', 'blabla');
  }
});

heroModules.push({
  template: 'updateBanner'
});