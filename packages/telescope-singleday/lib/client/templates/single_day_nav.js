var getDateRoute = function (moment) {
  FlowRouter.watchPathChange();
  var currentQuery = _.clone(FlowRouter.current().queryParams);
  var newQuery = _.extend(currentQuery, {
    year: moment.year(),
    month: moment.month() + 1,
    date: moment.date()
  });
  return FlowRouter.path('postsDefault', FlowRouter.current().params, newQuery);
};

Template.single_day_nav.onDestroyed(function(){

  $(document).unbind('keyup'); //clean up to prevent errors on other pages

});

Template.single_day_nav.helpers({
  currentDate: function(){
    return this.currentDate.format("dddd, MMMM Do YYYY");
  },
  previousDateURL: function(){
    var newDate = this.currentDate.subtract(1, 'days');
    return getDateRoute(newDate);
  },
  showPreviousDate: function(){
    // TODO
    return true;
  },
  nextDateURL: function(){
    var newDate = this.currentDate.add(1, 'days');
    return getDateRoute(newDate);
  },
  showNextDate: function(){
    var today = moment().startOf('day');
    return Users.is.admin(Meteor.user()) || (today.diff(this.currentDate, 'days') > 0);
  }
});
