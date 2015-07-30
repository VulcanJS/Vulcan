Meteor.startup(function () {

  Template.posts_daily.helpers({
    days: function () {
      var daysArray = [];
      for (var i = 0; i < this.daysCount; i++) {
        daysArray.push({
          date: moment().subtract(i, 'days').startOf('day').toDate(),
          index: i
        });
      }
      return daysArray;
    },
    context: function () {
      var days = Template.parentData(1);
      var context = {
        terms: {
          view: "singleday",
          date: this.date,
          after: moment(this.date).startOf('day').toDate(),
          before: moment(this.date).endOf('day').toDate(),
          enableCache: days.daysCount <= 15 ? true : false // only cache first 15 days
        }
      };
      return context;
    },
    loadMoreDaysUrl: function () {
      var count = parseInt(this.daysCount) + daysPerPage;
      return '/daily/' + count;
    }
  });

});
