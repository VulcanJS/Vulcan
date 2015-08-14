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
      //if the post is in the future and we aren't showing future, cap at current moment. Else use usual end of day
      var beforeDate = !Posts.views.baseParameters.showFuture && moment().isBefore(moment(this.date).endOf('day')) ?
              moment().toDate()
            : moment(this.date).endOf('day').toDate();
            
      var context = {
        terms: {
          view: "singleday",
          date: this.date,
          after: moment(this.date).startOf('day').toDate(),
          before: moment(this.date).endOf('day').toDate(),
          enableCache: true
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
