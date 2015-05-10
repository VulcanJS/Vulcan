/**
 * Controller for daily view
 */
Posts.controllers.daily = Posts.controllers.list.extend({

  view: "daily",

  template: function() {
    // use a function to make sure the template is evaluated *after* any template overrides
    // TODO: still needed?
    return 'postsDaily';
  },

  data: function () {
    this.days = this.params.days ? this.params.days : daysPerPage;
    Session.set('postsDays', this.days);
    return {
      days: this.days
    };
  }

});

Meteor.startup(function () {

  Router.route('/daily/:days?', {
    name: 'postsDaily',
    controller: Posts.controllers.daily
  });

});
