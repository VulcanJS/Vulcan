
var getDays = function (daysCount) {
  var daysArray = [];
  // var days = this.days;
  for (var i = 0; i < daysCount; i++) {
    daysArray.push({
      date: moment().subtract(i, 'days').startOf('day').toDate(),
      index: i
    });
  }
  return daysArray;
};

FastRender.route('/daily/:daysCount?',function (params) {

  var fr = this;
  var daysCount = params.daysCount ? params.daysCount : daysPerPage;
  var days = getDays(daysCount);

  days.forEach(function (day) {
    
    var subscriptionTerms = {
      view: "singleday",
      date: day.date,
      after: moment(day.date).startOf('day').toDate(),
      before: moment(day.date).endOf('day').toDate()
    }
    fr.subscribe('postsList', subscriptionTerms);

  })

});
