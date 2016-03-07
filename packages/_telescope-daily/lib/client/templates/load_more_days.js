Template.load_more_days.helpers({
  loadMoreDaysPath: function () {
    // FlowRouter.watchPathChange()
    // var currentQuery = _.clone(FlowRouter.current().queryParams);
    // var days = (FlowRouter.getQueryParam("days") || daysPerPage) + daysPerPage;
    // var newQuery = _.extend(currentQuery, {days: days});
    // return FlowRouter.path("postsDefault", FlowRouter.current().params, newQuery);
  }
});

Template.load_more_days.events({
  'click .load-more-days-button': function (e, instance) {
    e.preventDefault();
    instance.data.handler();
  }
});