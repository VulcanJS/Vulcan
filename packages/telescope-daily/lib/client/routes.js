Meteor.startup(function () {

  var coreSubscriptions = new SubsManager({
    // cache recent 50 subscriptions
    cacheLimit: 50,
    // expire any subscription after 30 minutes
    expireIn: 30
  });
  
  Router.map(function() {

    PostsDailyController = FastRender.RouteController.extend({
      template: getTemplate('posts_daily'),
      onBeforeAction: function() {
        this.days = this.params.days ? this.params.days : 3;
        
        var terms = {
          view: 'daily',
          after: moment().subtract('days', this.days).startOf('day').toDate()
        };

        this.postsSubscription = coreSubscriptions.subscribe('postsList', terms, function() {
          Session.set('postsLoaded', true);
        });

        this.postsUsersSubscription = coreSubscriptions.subscribe('postsListUsers', terms);

        return [this.postsSubscription, this.postsUsersSubscription];

      },
      data: function() {
        return {
          days: this.days
        };
      }
    });

    this.route('postsDaily', {
      path: '/daily/:days?',
      controller: PostsDailyController
    });

  });

});