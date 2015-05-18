Meteor.startup(function () {

  Template.posts_daily.helpers({
    days: function () {
      var daysArray = [];
      // var days = this.days;
      var days = Session.get('postsDays');
      for (var i = 0; i < days; i++) {
        daysArray.push({
          date: moment().subtract(i, 'days').startOf('day').toDate(),
          index: i
        });
      }
      return daysArray;
    },
    context: function () {
      var context = {
        terms: {
          view: "singleday",
          date: this.date,
          after: moment(this.date).startOf('day').toDate(),
          before: moment(this.date).endOf('day').toDate()
        }
      };
      return context;
    },
    loadMoreDaysUrl: function () {
      var count = parseInt(Session.get('postsDays')) + daysPerPage;
      return '/daily/' + count;
    }
  });

});
