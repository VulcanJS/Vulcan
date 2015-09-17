Template.single_day.helpers({
  currentDate: function () {
    return moment(FlowRouter.getQueryParam("after"), "YYYY-MM-DD");
  },
  arguments: function () {

    // note: will default to current date if FlowRouter.getQueryParam("after") returns "undefined"
    var terms = _.extend(_.clone(FlowRouter.current().queryParams), {
      after: FlowRouter.getQueryParam("after"),
      before: FlowRouter.getQueryParam("before"),
      enableCache: true
    });

    return {terms: terms};
  }
})