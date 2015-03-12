var coreSubscriptions = new SubsManager({
  // cache recent 50 subscriptions
  cacheLimit: 50,
  // expire any subscription after 30 minutes
  expireIn: 30
});

PostsDailyController = RouteController.extend({
  
  template: function() {
    // use a function to make sure the template is evaluated *after* any template overrides
    return getTemplate('postsDaily');
  },

  subscriptions: function () {
    // this.days = this.params.days ? this.params.days : daysPerPage;
    // TODO: find a way to preload the first n posts of the first 5 days?
  },

  data: function () {
    this.days = this.params.days ? this.params.days : daysPerPage;
    Session.set('postsDays', this.days);
    return {
      days: this.days
    };
  },

  getTitle: function () {
    return i18n.t('daily') + ' - ' + getSetting('title', "Telescope");
  },

  getDescription: function () {
    return i18n.t('day_by_day_view');
  },

  fastRender: true
});

Meteor.startup(function () {
  
  Router.route('/daily/:days?', {
    name: 'postsDaily',
    controller: PostsDailyController
  });

});