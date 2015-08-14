/**
 * Controller for daily view
 */
Posts.controllers.daily = Posts.controllers.list.extend({

  view: "daily",

  template: function() {
    // use a function to make sure the template is evaluated *after* any template overrides
    // TODO: still needed?
    return 'posts_daily';
  },

  data: function () {
    var daysCount = this.params.query.days ? this.params.query.days : daysPerPage;
    return {
      daysCount: daysCount
    };
  }

});

Meteor.startup(function () {

  Router.route('/daily/:daysCount?', {
    name: 'postsDaily',
    template: 'posts_daily',
    controller: Posts.controllers.daily
  });

});
