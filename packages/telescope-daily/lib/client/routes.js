Meteor.startup(function () {

  Router.map(function() {

    PostsDailyController = FastRender.RouteController.extend({
      template: getTemplate('posts_daily'),
      waitOn: function() {
        // if number of days is set use that, else default to 3
        var days = this.params.days ? this.params.days : 3,
            terms = {
              view: 'daily',
              after: moment().subtract('days', days).startOf('day').toDate()
            };
        return [
          coreSubscriptions.subscribe('postsList', terms),
          coreSubscriptions.subscribe('postsListUsers', terms)
        ];
      },
      data: function() {
        var days = this.params.days ? this.params.days : 3,
            terms = {
              view: 'daily',
              after: moment().subtract('days', days).startOf('day').toDate()
            },
            parameters = getParameters(terms);
        Session.set('currentDate', currentDate);
        return {
          posts: Posts.find(parameters.find, parameters.options)
        };
      }
    });

    this.route('posts_daily', {
      path: '/daily/:days?',
      controller: PostsDailyController
    });

  });

});