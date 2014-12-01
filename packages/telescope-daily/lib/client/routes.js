var daysPerPage = 5;

var coreSubscriptions = new SubsManager({
  // cache recent 50 subscriptions
  cacheLimit: 50,
  // expire any subscription after 30 minutes
  expireIn: 30
});

// note: FastRender not defined here?

PostsDailyController = RouteController.extend({
  template: function() {
    return getTemplate('postsDaily');
  },
  subscriptions: function() {
    this.days = this.params.days ? this.params.days : daysPerPage;
    // this.days = Session.get('postsDays') ? Session.get('postsDays') : 3;

    var terms = {
      view: 'daily',
      days: this.days,
      after: moment().subtract(this.days, 'days').startOf('day').toDate()
    };

    this.postsSubscription = coreSubscriptions.subscribe('postsList', terms, function() {
      Session.set('postsLoaded', true);
    });

    this.postsUsersSubscription = coreSubscriptions.subscribe('postsListUsers', terms);

  },
  data: function() {
    Session.set('postsDays', this.days);
    return {
      days: this.days
    };
  }
});

Meteor.startup(function () {
  
  Router.route('/daily/:days?', {
    name: 'postsDaily',
    controller: PostsDailyController
  });

});