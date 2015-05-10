/**
 * Controller for single day view
 */
Posts.controllers.singleday = Posts.controllers.list.extend({

  view: 'singleday',
  
  template: 'single_day', // use single_day template to get prev/next day navigation

  data: function() {
    var currentDate = this.params.day ? new Date(this.params.year, this.params.month-1, this.params.day) : Session.get('today');
    var terms = {
      view: 'singleday',
      date: currentDate,
      after: moment(currentDate).startOf('day').toDate(),
      before: moment(currentDate).endOf('day').toDate()
    };
    return {terms: terms};
  },

});

Meteor.startup(function () {

  // Digest

  Router.route('/day/:year/:month/:day', {
    name: 'postsSingleDay',
    controller: Posts.controllers.singleday
  });

  Router.route('/day', {
    name: 'postsSingleDayDefault',
    controller: Posts.controllers.singleday
  });

});
