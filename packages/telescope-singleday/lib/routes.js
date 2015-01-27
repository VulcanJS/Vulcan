// Controller for post digest

PostsSingleDayController = RouteController.extend({

  template: getTemplate('singleDay'),

  data: function() {
    var currentDate = this.params.day ? new Date(this.params.year, this.params.month-1, this.params.day) : Session.get('today');
    Session.set('currentDate', currentDate);
  },

  getTitle: function () {
    return i18n.t('single_day') + ' - ' + getSetting('title', 'Telescope');
  },

  getDescription: function () {
    return i18n.t('posts_of_a_single_day');
  },

  fastRender: true

});

Meteor.startup(function () {

  // Digest

  Router.route('/day/:year/:month/:day', {
    name: 'postsSingleDay',
    controller: PostsSingleDayController
  });

  Router.route('/day', {
    name: 'postsSingleDayDefault',
    controller: PostsSingleDayController
  });

});