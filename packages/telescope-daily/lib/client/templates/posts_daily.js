Template.posts_daily.onCreated(function () {
  var template = this;
  var daysCount = FlowRouter.getQueryParam("days") || daysPerPage;
  template.daysCount = new ReactiveVar(daysCount);
});

Template.posts_daily.helpers({
  days: function () {
    var instance = Template.instance();
    var daysCount = instance.daysCount.get();

    var daysArray = [];
    for (var i = 0; i < daysCount; i++) {
      daysArray.push({
        date: moment().subtract(i, 'days').startOf('day').toDate(),
        index: i
      });
    }
    return daysArray;
  },
  arguments: function () {
    var instance = Template.instance();
    var daysCount = instance.daysCount.get();

    // var days = Template.parentData(1);
    var context = {
      terms: {
        view: "top",
        date: this.date,
        after: moment(this.date).format("YYYY-MM-DD"),
        before: moment(this.date).format("YYYY-MM-DD"),
        enableCache: daysCount <= 15 ? true : false // only cache first 15 days
      }
    };
    return context;
  },
  loadMoreHandler: function () {
    var instance = Template.instance();
    var daysCount = instance.daysCount.get();

    return function () {
      var newCount = daysCount + daysPerPage;
      instance.daysCount.set(newCount);
    };
  }
});
