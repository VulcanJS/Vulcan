// Controller for post digest

PostsSingledayController = RouteController.extend({

  template: 'singleDay',

  onBeforeAction: function () {
    this.render('postListTop', {to: 'postListTop'});
    this.next();
  },

  data: function() {
    var currentDate = this.params.day ? new Date(this.params.year, this.params.month-1, this.params.day) : Session.get('today');
    return {
      terms: {
        view: 'singleday',
        date: currentDate,
        after: moment(currentDate).startOf('day').toDate(),
        before: moment(currentDate).endOf('day').toDate()
      }
    };
  },

  getTitle: function () {
    return i18n.t('single_day');
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
    controller: PostsSingledayController
  });

  Router.route('/day', {
    name: 'postsSingleDayDefault',
    controller: PostsSingledayController
  });

});
