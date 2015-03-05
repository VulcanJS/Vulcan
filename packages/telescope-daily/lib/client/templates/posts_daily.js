Meteor.startup(function () {

  Template[getTemplate('postsDaily')].helpers({
    days: function () {
      var daysArray = [];
      // var days = this.days;
      var days = Session.get('postsDays');
      for (i = 0; i < days; i++) {
        daysArray.push({
          date: moment().subtract(i, 'days').startOf('day').toDate(),
          index: i
        });
      }
      return daysArray;
    },
    before_day: function () {
      return getTemplate('beforeDay');
    },
    singleDay: function () {
      return getTemplate('singleDay');
    },
    context: function () {
      var context = this;
      context.showDateNav = false;
      return context;
    },
    after_day: function () {
      return getTemplate('afterDay');
    },
    loadMoreDaysUrl: function () {
      var count = parseInt(Session.get('postsDays')) + daysPerPage;
      return '/daily/' + count;
    }
  });

});
